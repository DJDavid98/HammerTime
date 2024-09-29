import { promises as fs } from 'fs';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { IndexedReportData, ReportUserData } from 'src/util/crowdin';
import localeConfig from '../public/locales/config.json';
import { AvailableLanguage, isAvailableLanguage, LANGUAGES } from '../src/config';
import { LanguageConfig } from '../src/model/language-config';
import { normalizeCredit, NormalizedCredits } from '../src/util/translation';

dotenvConfig();

const markerString = '### Credits';
const readmeFolder = path.join(__dirname, '..');
const readmePath = path.join(readmeFolder, 'README.md');

const mapCreditToString = (credit: NormalizedCredits) => `[${credit.displayName}](${credit.url})`;

/* eslint-disable no-console */

interface ProjectListResponse {
  data: ProjectData[];
}

interface ProjectData {
  data: {
    id: number;
    identifier: string;
  };
}

interface ProjectTranslationProgressResponse {
  data: Array<{
    data: {
      translationProgress: number;
      approvalProgress: number;
      languageId: string;
      language: CrowdinLanguage;
    };
  }>;
  pagination: {
    offset: number;
    limit: number;
  };
}

interface ProjectReportResponse {
  data: {
    identifier: string;
    status: string;
    /** in percentages */
    progress: number;
    /** <date-time> */
    createdAt: string;
    /** <date-time> */
    updatedAt: string;
    /** <date-time> */
    startedAt: string;
    /** <date-time> */
    finishedAt: string;
  };
}

interface ProjectReportDownloadResponse {
  data: {
    url: string;
    expireIn: string;
  };
}

export interface CrowdinLanguage {
  id: string;
  name: string;
}

interface ProjectReportDataResponse {
  name: string;
  url: string;
  unit: string;
  dateRange: {
    from: string;
    to: string;
  };
  language: string;
  data: Array<{
    user: {
      id: string;
      username: string;
      fullName: string;
      avatarUrl: string;
      joined: string;
    };
    languages: Array<CrowdinLanguage>;
    translated: number;
    approved: number;
    voted: number;
    positiveVotes: number;
    negativeVotes: number;
    winning: number;
  }>;
}

void (async () => {
  const crowdinApiKey = process.env.CROWDIN_API_KEY as string;
  if (!crowdinApiKey) {
    console.warn('Missing Crowdin API key, skipping translation credits generation.');
    return;
  }

  const crowdinProjectIdentifier = process.env.CROWDIN_PROJECT_IDENTIFIER;
  if (!crowdinProjectIdentifier) {
    console.warn('Missing Crowdin project identifier, skipping translation credits generation.');
    return;
  }

  console.info('Reading README file…');
  const readmeText = await fs.readFile(readmePath, 'utf8');

  console.info('Finding marker text…');
  const markerIndex = readmeText.indexOf(markerString);
  if (markerIndex === -1) {
    throw new Error(`Marker "${markerString}" not found in ${readmePath}`);
  }
  const readmeTextBeforeMarker = readmeText.substring(0, markerIndex);

  const rawReportDataCachePath = path.join(readmeFolder, 'crowdin_report.json5');
  const useCache = process.env.CROWDIN_REPORT_CACHE === 'true';
  const cacheDurationHours = 1;

  const cachedDataExists = useCache
    ? await fs
        .stat(rawReportDataCachePath)
        .then((stats) => {
          const cacheExpiresAtMs = stats.mtimeMs + cacheDurationHours * 60 * 60e3;
          const currentTimeMs = new Date().getTime();
          const cacheValid = currentTimeMs < cacheExpiresAtMs;
          if (cacheValid) {
            const cacheExpiresInMs = cacheExpiresAtMs - currentTimeMs;
            console.info(`Cache expires in ${Math.round(cacheExpiresInMs / 1000)}s`);
          } else {
            const cacheExpiredAgoMs = currentTimeMs - cacheExpiresAtMs;
            console.info(`Cache expired ${Math.round(cacheExpiredAgoMs / 1000)}s ago and will be refreshed`);
          }
          return cacheValid;
        })
        .catch((e) => {
          if (e instanceof Error && e.message.includes('ENOENT')) {
            console.info(`Cache file ${rawReportDataCachePath} missing and will be generated`);
          } else {
            console.warn(`Failed to access cache at ${rawReportDataCachePath}`);
            console.warn(e);
          }
          return false;
        })
    : false;

  console.info('Getting project information from Crowdin…');
  const projectList = await fetch('https://api.crowdin.com/api/v2/projects?hasManagerAccess=1', {
    headers: {
      Authorization: `Bearer ${crowdinApiKey}`,
    },
  }).then((r) => r.json() as Promise<ProjectListResponse>);

  const projects = (projectList.data as ProjectData[]).reduce(
    (acc: Record<string, number>, p) => ({
      ...acc,
      [p.data.identifier]: p.data.id,
    }),
    {},
  );

  console.info(
    `Found projects:\n${Object.entries(projects)
      .map(([identifier, id]) => `${id}. ${identifier}`)
      .join('\n')}`,
  );

  console.info(`Checking for project with identifier ${crowdinProjectIdentifier}…`);
  const crowdinProjectId = projects[crowdinProjectIdentifier];
  if (!crowdinProjectId) {
    throw new Error(`Could not find Crowdin project with identifier "${crowdinProjectIdentifier}"`);
  }

  let rawReportData: ProjectReportDataResponse;
  if (!cachedDataExists || !useCache) {
    const reportName = 'top-members';
    console.info(`Creating new ${reportName} report on Crowdin…`);
    const createReportResponse = await fetch(`https://api.crowdin.com/api/v2/projects/${crowdinProjectId}/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${crowdinApiKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: reportName,
        schema: {
          unit: 'strings',
          format: 'json',
          dateFrom: '1970-01-01T00:00:00+00:00',
          dateTo: new Date().toISOString(),
        },
      }),
    });

    if (!createReportResponse.ok) {
      throw new Error(
        `Failed to create report (HTTP ${createReportResponse.status} ${
          createReportResponse.statusText
        })\n${await createReportResponse.text()}`,
      );
    }
    const createReportResult = (await createReportResponse.json()) as ProjectReportResponse;

    // Used for exponential backoff
    let pollIntervalFactor = 0;
    const reportId = createReportResult.data.identifier;
    console.info(`Report export started with id ${reportId}, checking for status…`);
    rawReportData = await new Promise<ProjectReportDataResponse>((res) => {
      let reportCheckTimeout: ReturnType<typeof setTimeout> | null = null;

      function checkForReportStatus() {
        if (reportCheckTimeout) {
          clearTimeout(reportCheckTimeout);
        }
        const nextTimeoutMs = 100 * 2 ** pollIntervalFactor++;
        console.info(`Running next check in ${nextTimeoutMs}ms…`);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        reportCheckTimeout = setTimeout(() => void checkerFunction(), nextTimeoutMs);
      }

      async function checkerFunction() {
        const reportCheckResult = await fetch(`https://api.crowdin.com/api/v2/projects/${crowdinProjectId}/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${crowdinApiKey}`,
          },
        }).then((r) => r.json() as Promise<ProjectReportResponse>);

        console.info(
          `Report ${reportCheckResult.data.identifier} status: ${reportCheckResult.data.status} (progress: ${reportCheckResult.data.progress}%)`,
        );
        if (reportCheckResult.data.progress < 100) {
          checkForReportStatus();
          return;
        }

        console.info(`Getting report ${reportCheckResult.data.identifier} download link…`);
        const reportDownloadData = await fetch(`https://api.crowdin.com/api/v2/projects/${crowdinProjectId}/reports/${reportId}/download`, {
          headers: {
            Authorization: `Bearer ${crowdinApiKey}`,
          },
        }).then((r) => r.json() as Promise<ProjectReportDownloadResponse>);

        console.info(`Downloading report ${reportCheckResult.data.identifier}… (url: ${reportDownloadData.data.url})`);
        const reportDataResponse = await fetch(reportDownloadData.data.url);
        if (!reportDataResponse.ok) {
          throw new Error(
            `Failed to get report (HTTP ${reportDataResponse.status} ${reportDataResponse.statusText})\n${await reportDataResponse.text()}`,
          );
        }

        const reportData = (await reportDataResponse.json()) as ProjectReportDataResponse;

        // Write report to file, for debug purposes
        if (process.env.CROWDIN_REPORT_DEBUG === 'true' || useCache) {
          console.info(`Writing raw report data to ${rawReportDataCachePath}…`);
          const rawReportDataString = [
            `// Generated at ${new Date().toISOString()} based on Crowding project ${crowdinProjectId} report ${reportId}`,
            `// Downloaded from ${reportDownloadData.data.url} (link expires at ${reportDownloadData.data.expireIn})`,
            JSON.stringify(reportData, null, 2),
          ].join('\n');
          await fs.writeFile(rawReportDataCachePath, rawReportDataString);
        }

        res(reportData);
      }

      checkForReportStatus();
    });
  } else {
    console.info(`Reading Crowdin data from cache file ${rawReportDataCachePath}…`);
    const rawReportDataString = await fs.readFile(rawReportDataCachePath).then((r) => r.toString());
    // Data validation? Is that a rare Pokemon? - but seriously if you tamper with this file manually you have only yourself to blame
    rawReportData = JSON.parse(rawReportDataString.replace(/^\/\/.*$/gm, '')) as typeof rawReportData;
  }

  console.info(`Reading translation progress for project ${crowdinProjectIdentifier}…`);
  const translationProgressResponse = await fetch(
    `https://api.crowdin.com/api/v2/projects/${crowdinProjectId}/languages/progress?limit=${Object.keys(LANGUAGES).length}`,
    {
      headers: {
        Authorization: `Bearer ${crowdinApiKey}`,
      },
    },
  ).then((r) => r.json() as Promise<ProjectTranslationProgressResponse>);

  console.info(`Creating assembled report data…`);
  const indexedReportData: IndexedReportData = {
    meta: `Generated at ${new Date().toISOString()}`,
    users: {},
    progress: {
      en: { approval: 100, translation: 100 },
    },
  };
  const languageMapping: Record<string, AvailableLanguage> = {
    /* eslint-disable @typescript-eslint/naming-convention */
    'zh': 'zh-TW',
    'zh-CN': 'zh',
    'pt': 'pt-BR',
    'pt-PT': 'pt',
    'sr-CS': 'sr',
    'ur-PK': 'ur',
    'es-ES': 'es',
    'sv-SE': 'sv',
    'no': 'nb',
    /* eslint-enable @typescript-eslint/naming-convention */
  };
  const mapCrowdinLanguageToAvailableLanguage = (crowdinLanguage: CrowdinLanguage): AvailableLanguage | null => {
    if (crowdinLanguage.id in languageMapping) {
      return languageMapping[crowdinLanguage.id];
    }
    if (!isAvailableLanguage(crowdinLanguage.id)) {
      console.warn(`Language ${crowdinLanguage.id} (${crowdinLanguage.name}) is missing from the available languages list`);
      return null;
    }

    return crowdinLanguage.id;
  };
  translationProgressResponse.data.sort((a, b) => a.data.languageId.localeCompare(b.data.languageId));
  translationProgressResponse.data.forEach(({ data: languageProgress }) => {
    const availableLanguageCode = mapCrowdinLanguageToAvailableLanguage(languageProgress.language);
    if (!availableLanguageCode) {
      return;
    }
    indexedReportData.progress[availableLanguageCode] = {
      approval: languageProgress.approvalProgress,
      translation: languageProgress.translationProgress,
    };
  });
  rawReportData.data.sort((a, b) => a.user.username.localeCompare(b.user.username));
  rawReportData.data.forEach((reportDataItem) => {
    if (reportDataItem.approved === 0 && reportDataItem.voted === 0 && reportDataItem.translated === 0) {
      // Skip users with virtually 0 activity
      return;
    }
    const username = reportDataItem.user.username;
    let fullName = reportDataItem.user.fullName;
    if (fullName === username) {
      fullName = '';
    } else {
      // Removing username at the end of the full name
      fullName = fullName.replace(/\s\([^)]+\)$/, '');
    }
    const reportUserData: ReportUserData = {
      avatarUrl: reportDataItem.user.avatarUrl,
    };
    if (fullName) {
      reportUserData.fullName = fullName;
    }
    if (reportDataItem.languages.length > 0) {
      reportUserData.languages = reportDataItem.languages.reduce((acc: AvailableLanguage[], language) => {
        const mappedLanguage = mapCrowdinLanguageToAvailableLanguage(language);
        if (!mappedLanguage) {
          return acc;
        }
        return [...acc, mappedLanguage];
      }, []);
    }

    indexedReportData.users[username] = reportUserData;
  });
  const assembledReportDataOutputPath = path.join(readmeFolder, 'public', 'locales', 'crowdin.json');
  console.info(`Writing assembled report data to ${assembledReportDataOutputPath}…`);
  const assembledReportDataString = JSON.stringify(indexedReportData, null, 2);
  await fs.writeFile(assembledReportDataOutputPath, assembledReportDataString);

  console.info('Generating credits text…');
  const creditsText = [markerString, ''];
  const sortedConfigs: LanguageConfig[] = Object.values(localeConfig.languages).sort((c1, c2) => c1.name.localeCompare(c2.name));
  sortedConfigs.forEach((config) => {
    const languageString = `- ${config.emoji ? `${config.emoji} ` : ''}${config.name}`;
    if (config.credits) {
      const creditCount = config.credits.length;
      switch (creditCount) {
        case 0:
          // No credits, omit language from README (primarily for included languages)
          break;
        case 1:
          creditsText.push(`${languageString}: ${mapCreditToString(normalizeCredit(config.credits[0], indexedReportData))}`);
          break;
        default: {
          creditsText.push(languageString);

          const sortedCredits = config.credits
            .map((c) => normalizeCredit(c, indexedReportData))
            .sort((cr1, cr2) => cr1.displayName.localeCompare(cr2.displayName));

          sortedCredits.forEach((credit) => {
            creditsText.push(`  - ${mapCreditToString(credit)}`);
          });
        }
      }
    }
  });
  const finalReadme = `${readmeTextBeforeMarker + creditsText.join('\n')}\n`;

  console.info('Writing updated README file…');
  await fs.writeFile(readmePath, finalReadme, 'utf8');

  console.info('README file updated');
})();
