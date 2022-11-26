/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config.js');
const { redirects } = require('./vercel.json');

module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['ui'],
  },
  i18n,
  redirects: async () => redirects,
};
