import path from 'path';
import { promises as fs } from 'fs';
import { LanguageConfigV1 } from 'src/model/legacy';
import { AvailableLanguage, LatestLanguageConfigType } from 'src/config';
import { LanguageConfigV2 } from 'src/model/language-config';
import { TranslationCreditOverride } from 'src/model/translation-credit-override';

/* eslint-disable no-console */

interface PublicLocalesConfig<V extends number = number> {
  version: V;
  languages: Record<AvailableLanguage, V extends 1 ? LanguageConfigV1 : V extends 2 ? LanguageConfigV2 : LatestLanguageConfigType>;
}

export const forEachLanguage = (configContent: PublicLocalesConfig, iterator: (language: AvailableLanguage) => void) => {
  const languages = Object.keys(configContent.languages) as AvailableLanguage[];
  languages.forEach(iterator);
};

/**
 * @return whether any migrations were executed
 */
const runMigration = (currentConfig: PublicLocalesConfig): PublicLocalesConfig => {
  const { version, ...configContent } = currentConfig;
  let migratedConfigContent: PublicLocalesConfig = currentConfig;
  /* eslint-disable no-fallthrough,default-case,no-empty,no-param-reassign */
  // noinspection FallThroughInSwitchStatementJS
  switch (version) {
    // @ts-expect-error We want fall-through here, actually.
    case undefined:
      migratedConfigContent = { version: 1, ...configContent };
    case 1: {
      const previousVersionContent = migratedConfigContent as unknown as PublicLocalesConfig<1>;
      migratedConfigContent = { version: 2, languages: {} } as PublicLocalesConfig<2>;
      forEachLanguage(previousVersionContent, (language) => {
        const { credits, ...rest } = previousVersionContent.languages[language];
        migratedConfigContent.languages[language] = rest;

        if (Array.isArray(credits) && credits.length > 0) {
          const creditOverrides: LanguageConfigV2['creditOverrides'] = {};
          credits.forEach((credit) => {
            if (!credit.url && !credit.displayName && !credit.avatarUrl) {
              return;
            }
            const override: TranslationCreditOverride = {};
            if (credit.displayName) {
              override.displayName = credit.displayName;
            }
            if (credit.url) {
              override.url = credit.url;
            }
            if (credit.avatarUrl) {
              override.avatarUrl = credit.avatarUrl;
            }
            creditOverrides[credit.crowdinId] = override;
          });
          if (Object.keys(creditOverrides).length > 0) {
            migratedConfigContent.languages[language].creditOverrides = creditOverrides;
          }
        }
      });
    }
    // Add new migrations here
  }
  /* eslint-enable no-fallthrough,default-case,no-empty */

  return migratedConfigContent;
};

export async function migrateLanguageConfig(rootDir: string): Promise<void> {
  const localesConfigPath = path.join(rootDir, 'public', 'locales', 'config.json');
  const configContentString = await fs.readFile(localesConfigPath, 'utf8').then((r) => r.toString());
  const configContent = JSON.parse(configContentString) as PublicLocalesConfig;
  const version = configContent.version;
  console.info(`Migrating public locales config from version ${version}…`);
  const migratedConfigContent = runMigration(configContent);
  if (migratedConfigContent === configContent) {
    console.info('Locales config is already the latest version, no migration needed');
    return;
  }

  // Save migrated config
  console.info(`Writing migrated locale config with version ${migratedConfigContent.version}…`);
  // Add final newline for cleaner Git diffs
  const finalConfigContent = `${JSON.stringify(migratedConfigContent, null, 2)}\n`;
  await fs.writeFile(localesConfigPath, finalConfigContent, 'utf8');

  console.info('Public locales config migrated successfully.');
}
