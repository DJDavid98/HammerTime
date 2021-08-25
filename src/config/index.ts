import type { AppI18nNamespaces } from 'react-i18next';
import localeConfig from '../../public/locales/config.json';

export const SITE_TITLE = 'HammerTime';
export const CANONICAL_URL = 'https://hammertime.djdavid98.art';
export const REPOSITORY_URL = 'https://github.com/DJDavid98/HammerTime';
export const FONTAWESOME_FREE_LICENSE_URL = 'https://fontawesome.com/license/free';

export const IS_CLIENT_SIDE = typeof window !== 'undefined';

export type AvailableLanguage = keyof typeof localeConfig.languages;

type LanguagesConfig = Record<
  AvailableLanguage,
  {
    nativeName: string;
    countryCode: string;
    rtl?: boolean;
    momentLocale?: string;
  }
>;

export const LANGUAGES: LanguagesConfig = localeConfig.languages;

export const DEFAULT_I18N_NAMESPACES: AppI18nNamespaces[] = ['common'];

export const isAvailableLanguage = (language: string): language is AvailableLanguage => language in LANGUAGES;
