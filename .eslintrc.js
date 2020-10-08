module.exports = {
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // Disable rules handled by prettier
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',

    // Disables rules we choose not to apply
    'import/prefer-default-export': 'off',
    'react/forbid-prop-types': 'off',
    'react/sort-comp': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-underscore-dangle': 0,
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
