import 'react-i18next';
import commonNs from '../public/locales/en/common.json';
import inputsNs from '../public/locales/en/inputs.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof commonNs;
      inputs: typeof inputsNs;
    };
  }

  export type AppI18nNamespaces = keyof CustomTypeOptions['resources'] & string;
}
