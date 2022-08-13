import { MouseEvent, MouseEventHandler, useMemo } from 'react';
import { CANONICAL_URL, IS_CLIENT_SIDE, isAvailableLanguage, LANGUAGES } from 'src/config';

export const useLocale = (language?: string) =>
  useMemo<string>(() => {
    if (language && isAvailableLanguage(language)) {
      return LANGUAGES[language].momentLocale || language;
    }
    return 'en';
  }, [language]);

export const assembleSeoUrl = (pathname?: string, forceCanonical = false): string => {
  const protocol = IS_CLIENT_SIDE ? location.protocol : 'https:';
  const host = IS_CLIENT_SIDE ? location.host : process.env.NEXT_PUBLIC_VERCEL_URL;
  return `${forceCanonical || !host ? CANONICAL_URL : `${protocol}//${host}`}${pathname || ''}`;
};

export const canonicalUrlForLanguage = (pathname: string, language?: string, defaultLanguage?: string) => {
  const nonDefaultLanguage = language && language !== defaultLanguage;
  return assembleSeoUrl(`${nonDefaultLanguage ? `/${language}` : ''}${pathname === '/' && nonDefaultLanguage ? '' : pathname}`, true);
};

export const getDirAttribute = (locale?: string): 'rtl' | 'ltr' =>
  locale && isAvailableLanguage(locale) && LANGUAGES[locale].rtl ? 'rtl' : 'ltr';

/**
 * @see https://developer.chrome.com/blog/show-picker/
 */
export const inputWithPickerClickHandler: MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
  const label = (e.target as HTMLElement).closest('label') as HTMLLabelElement | null;
  if (!label) return;
  const targetId = label.htmlFor;
  if (!targetId) return;
  const target = document.querySelector(`input#${targetId}`) as HTMLInputElement | null;
  if (!target) return;
  if ('showPicker' in HTMLInputElement.prototype) {
    try {
      (target as unknown as { showPicker: VoidFunction }).showPicker();
      return;
    } catch (error) {
      console.error(error);
    }
  }

  target.focus();
};
