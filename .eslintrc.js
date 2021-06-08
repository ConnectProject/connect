module.exports = {
  extends: ['airbnb', 'prettier', 'naat', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Enable additional rules
    'no-throw-literal': 'warn',

    // Disable rule incompatible with eslint-plugin-import rule import/order
    'sort-imports': 'off',

    // Disables rules we choose not to apply
    // 'import/prefer-default-export': 'off',
    // 'react/forbid-prop-types': 'off',
    // 'react/sort-comp': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'no-underscore-dangle': 'off',
    // Rewrite airbnb rule to allow ForOfStatement
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
  overrides: [
    {
      files: ['bin/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  globals: {
    it: 'readonly',
    describe: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
};
