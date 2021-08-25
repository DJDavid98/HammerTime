import { useMemo } from 'react';
import { AvailableLanguage, CANONICAL_URL, IS_CLIENT_SIDE, isAvailableLanguage, LANGUAGES } from 'src/config';

export const localeMap: Record<AvailableLanguage, string> = {
  'en': 'en',
  'en-GB': 'en-gb',
  'hu': 'hu',
  'fr': 'fr',
  'ru': 'ru',
};

export const useLocale = (language: string) =>
  useMemo<string>(() => (isAvailableLanguage(language) && localeMap[language]) || 'en', [language]);

export const assembleSeoUrl = (pathname?: string): string => {
  const protocol = IS_CLIENT_SIDE ? location.protocol : 'https:';
  const host = IS_CLIENT_SIDE ? location.host : undefined;
  return `${host ? `${protocol}//${host}` : CANONICAL_URL}${pathname || ''}`;
};

export const getDirAttribute = (locale?: string): 'rtl' | 'ltr' =>
  locale && isAvailableLanguage(locale) && LANGUAGES[locale].rtl ? 'rtl' : 'ltr';
