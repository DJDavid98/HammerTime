module.exports = {
  extends: ['next', 'turbo', 'next/core-web-vitals', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['../../tsconfig.json', '../../packages/*/tsconfig.json', '../../apps/*/tsconfig.json'],
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
