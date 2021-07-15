import { useMemo } from 'react';
import { AvailableLanguage, CANONICAL_URL, IS_CLIENT_SIDE } from 'src/config';

export const localeMap: Record<AvailableLanguage, string> = {
  en: 'en',
  hu: 'hu',
  fr: 'fr',
};

export const useLocale = (language: string) => useMemo<string>(() => localeMap[language as AvailableLanguage] || 'en', [language]);

export const assembleSeoUrl = (pathname?: string): string => {
  const protocol = IS_CLIENT_SIDE ? location.protocol : 'https:';
  const host = IS_CLIENT_SIDE ? location.host : undefined;
  return `${host ? `${protocol}//${host}` : CANONICAL_URL}${pathname || ''}`;
};
