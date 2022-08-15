const { i18n } = require('./next-i18next.config.js');
const { redirects } = require('./vercel.json');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./utils/next-css-modules');

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPlugins([[withCamelCaseCSSModules]], {
  i18n,
  redirects: async () => redirects,
});
