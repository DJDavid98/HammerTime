const { i18n } = require('./next-i18next.config.js');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./utils/next-css-modules');

module.exports = withPlugins([[withCamelCaseCSSModules]], {
  i18n,
});
