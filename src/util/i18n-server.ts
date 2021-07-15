import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { AppI18nNamespaces } from 'react-i18next';
import { DEFAULT_I18N_NAMESPACES } from 'src/config';

export const typedServerSideTranslations = (locale?: string, keys?: AppI18nNamespaces[]) =>
  serverSideTranslations(locale as string, keys ? [...DEFAULT_I18N_NAMESPACES, ...keys] : DEFAULT_I18N_NAMESPACES);
