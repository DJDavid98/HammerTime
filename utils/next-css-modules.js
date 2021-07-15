// https://github.com/vercel/next.js/discussions/11267#discussioncomment-1758
module.exports = {
  webpack: (config) => {
    const rules = config.module.rules.find((rule) => typeof rule.oneOf === 'object').oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (/css-loader\/(?:cjs|dist)/.test(moduleLoader.loader) && typeof moduleLoader.options.modules === 'object') {
          moduleLoader.options = {
            ...moduleLoader.options,
            modules: {
              ...moduleLoader.options.modules,
              exportLocalsConvention: 'camelCaseOnly', // https://github.com/webpack-contrib/css-loader#exportlocalsconvention
            },
          };
        }
      });
    });

    return config;
  },
};
