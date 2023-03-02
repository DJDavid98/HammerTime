const { i18n } = require('./next-i18next.config.js');
const { redirects } = require('./vercel.json');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  i18n,
  redirects: async () => redirects,
};
