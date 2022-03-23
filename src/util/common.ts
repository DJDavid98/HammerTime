import { MouseEvent, MouseEventHandler, useMemo } from 'react';
import { CANONICAL_URL, IS_CLIENT_SIDE, isAvailableLanguage, LANGUAGES } from 'src/config';

export const useLocale = (language?: string) =>
  useMemo<string>(() => {
    if (language && isAvailableLanguage(language)) {
      return LANGUAGES[language].momentLocale || language;
    }
    return 'en';
  }, [language]);

export const assembleSeoUrl = (pathname?: string): string => {
  const protocol = IS_CLIENT_SIDE ? location.protocol : 'https:';
  const host = IS_CLIENT_SIDE ? location.host : process.env.NEXT_PUBLIC_VERCEL_URL;
  return `${host ? `${protocol}//${host}` : CANONICAL_URL}${pathname || ''}`;
};

export const getDirAttribute = (locale?: string): 'rtl' | 'ltr' =>
  locale && isAvailableLanguage(locale) && LANGUAGES[locale].rtl ? 'rtl' : 'ltr';

/**
 * @see https://developer.chrome.com/blog/show-picker/
 */
export const inputWithPickerClickHandler: MouseEventHandler<HTMLInputElement> = (e: MouseEvent<HTMLInputElement>) => {
  if ('showPicker' in HTMLInputElement.prototype) {
    try {
      (e.target as unknown as { showPicker: VoidFunction }).showPicker();
    } catch (error) {
      console.error(error);
    }
  }
};
