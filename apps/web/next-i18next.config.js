const { languages } = require('@hammertime/locales/src/config.json');

module.exports = {
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: 'en',
  },
};
