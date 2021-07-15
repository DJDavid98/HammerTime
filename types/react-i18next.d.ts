import 'react-i18next';
import commonNs from 'public/locales/en/common.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof commonNs;
    };
  }

  export type AppI18nNamespaces = keyof CustomTypeOptions['resources'] & string;
}
