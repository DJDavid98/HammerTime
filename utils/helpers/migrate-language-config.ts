import path from 'path';
import { promises as fs } from 'fs';
import { AvailableLanguage } from '../../src/config';
import { LanguageConfig } from '../../src/model/language-config';

/* eslint-disable no-console */

interface PublicLocalesConfig {
  version: number;
  languages: Record<AvailableLanguage, LanguageConfig>;
}

export const forEachLanguage = (configContent: PublicLocalesConfig, iterator: (language: AvailableLanguage) => void) => {
  const languages = Object.keys(configContent.languages) as AvailableLanguage[];
  languages.forEach(iterator);
};

export async function migrateLanguageConfig(rootDir: string): Promise<void> {
  const localesConfigPath = path.join(rootDir, 'public', 'locales', 'config.json');
  const configContentString = await fs.readFile(localesConfigPath, 'utf8').then((r) => r.toString());
  const configContent = JSON.parse(configContentString) as PublicLocalesConfig;
  const version = configContent.version;
  console.info(`Migrating public locales config from version ${version}…`);
  /* eslint-disable no-fallthrough,default-case,no-empty */
  // noinspection FallThroughInSwitchStatementJS
  switch (configContent.version) {
    case undefined:
      configContent.version = 1;
    // Add new migrations here
  }
  /* eslint-enable no-fallthrough,default-case,no-empty */

  if (configContent.version === version) {
    console.info('Locales config is already the latest version, no migration needed');
    return;
  }

  // Save migrated config
  console.info(`Writing migrated locale config with version ${configContent.version}…`);
  await fs.writeFile(localesConfigPath, JSON.stringify(configContent, null, 2), 'utf8');

  console.info('Public locales config migrated successfully.');
}
