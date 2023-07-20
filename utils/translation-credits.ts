import { promises as fs } from 'fs';
import path from 'path';
import localeConfig from '../public/locales/config.json';
import { LanguageConfig } from '../src/model/language-config';
import { normalizeCredit, NormalizedCredits } from '../src/util/translation';

const markerString = '### Credits';
const readmePath = path.join(__dirname, '..', 'README.md');

const mapCreditToString = (credit: NormalizedCredits) => `[${credit.displayName}](${credit.url})`;

/* eslint-disable no-console */

void (async () => {
  console.info('Reading README file…');
  const readmeText = await fs.readFile(readmePath, 'utf8');

  console.info('Finding marker text…');
  const markerIndex = readmeText.indexOf(markerString);
  if (markerIndex === -1) {
    throw new Error(`Marker "${markerString}" not found in ${readmePath}`);
  }
  const readmeTextBeforeMarker = readmeText.substring(0, markerIndex);

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
          creditsText.push(`${languageString}: ${mapCreditToString(normalizeCredit(config.credits[0]))}`);
          break;
        default: {
          creditsText.push(languageString);

          const sortedCredits = config.credits.map(normalizeCredit).sort((cr1, cr2) => cr1.displayName.localeCompare(cr2.displayName));

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
