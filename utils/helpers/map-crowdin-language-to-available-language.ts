import { AvailableLanguage, isAvailableLanguage } from '../../src/config';
import { CrowdinLanguage } from '../crowdin-api-types';

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
export const mapCrowdinLanguageToAvailableLanguage = (crowdinLanguage: CrowdinLanguage): AvailableLanguage | null => {
  if (crowdinLanguage.id in languageMapping) {
    return languageMapping[crowdinLanguage.id];
  }
  if (!isAvailableLanguage(crowdinLanguage.id)) {
    console.warn(`Language ${crowdinLanguage.id} (${crowdinLanguage.name}) is missing from the available languages list`);
    return null;
  }

  return crowdinLanguage.id;
};
