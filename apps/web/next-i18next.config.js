const {
  config: { languages },
} = require('@hammertime/locales');
const path = require('path');

module.exports = {
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: 'en',
  },
  localePath: typeof window === 'undefined' ? path.join(path.dirname(require.resolve('@hammertime/locales')), '..') : undefined,
};
