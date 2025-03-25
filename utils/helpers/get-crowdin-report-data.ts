import { promises as fs } from 'fs';
import { ProjectReportDataResponse, ProjectReportDownloadResponse, ProjectReportResponse } from '../crowdin-api-types';
import { crowdinApiRequest, crowdinApiRequestRaw } from './crowdin-api-request';

export interface GetCrowdinReportDataOptions {
  cachedDataExists: boolean;
  useCache: boolean;
  crowdinProjectId: string | number;
  crowdinApiKey: string;
  rawReportDataCachePath: string;
}

/* eslint-disable no-console */

export const getCrowdinReportData = async ({
  cachedDataExists,
  useCache,
  crowdinProjectId,
  crowdinApiKey,
  rawReportDataCachePath,
}: GetCrowdinReportDataOptions): Promise<ProjectReportDataResponse> => {
  let rawReportData: ProjectReportDataResponse;
  if (!cachedDataExists || !useCache) {
    const reportName = 'top-members';
    console.info(`Creating new ${reportName} report on Crowdin…`);
    const createReportResponse = await crowdinApiRequestRaw({
      path: `/projects/${crowdinProjectId}/reports`,
      crowdinApiKey,
      method: 'POST',
      headers: {
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
        const reportCheckResult = await crowdinApiRequest<ProjectReportResponse>({
          path: `/projects/${crowdinProjectId}/reports/${reportId}`,
          crowdinApiKey,
        });

        console.info(
          `Report ${reportCheckResult.data.identifier} status: ${reportCheckResult.data.status} (progress: ${reportCheckResult.data.progress}%)`,
        );
        if (reportCheckResult.data.progress < 100) {
          checkForReportStatus();
          return;
        }

        console.info(`Getting report ${reportCheckResult.data.identifier} download link…`);
        const reportDownloadData = await crowdinApiRequest<ProjectReportDownloadResponse>({
          path: `/projects/${crowdinProjectId}/reports/${reportId}/download`,
          crowdinApiKey,
        });

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
  return rawReportData;
};
