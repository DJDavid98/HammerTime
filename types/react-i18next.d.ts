import 'react-i18next';
import commonNs from 'public/locales/en/common.json';
import tableNs from 'public/locales/en/table.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof commonNs;
      table: typeof tableNs;
    };
  }

  export type AppI18nNamespaces = keyof CustomTypeOptions['resources'] & string;
}
