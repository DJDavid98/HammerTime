import type { AppI18nNamespaces } from 'react-i18next';

export const SITE_TITLE = 'HammerTime';
export const CANONICAL_URL = 'https://hammertime.djdavid98.art';
export const REPOSITORY_URL = 'https://github.com/DJDavid98/HammerTime';

export const IS_CLIENT_SIDE = typeof window !== 'undefined';

export type AvailableLanguage = 'hu' | 'en';

type LanguagesConfig = Record<
  AvailableLanguage,
  {
    nativeName: string;
  }
>;

export const LANGUAGES: LanguagesConfig = {
  en: {
    nativeName: 'English',
  },
  hu: {
    nativeName: 'Magyar',
  },
};

export const DEFAULT_I18N_NAMESPACES: AppI18nNamespaces[] = ['common'];
