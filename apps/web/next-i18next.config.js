const {
  config: { languages },
} = require('@hammertime/locales');

module.exports = {
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: 'en',
  },
};
