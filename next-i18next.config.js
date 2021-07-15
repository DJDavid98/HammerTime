const { languages } = require('./public/locales/config.json');

module.exports = {
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: 'en',
  },
};
