module.exports = {
  root: true,
  extends: ['react-app', 'plugin:jsx-a11y/recommended'],
  plugins: ['jsx-a11y'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['craco.config.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    semi: ['error', 'always'],
  },
};
