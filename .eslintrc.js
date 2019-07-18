module.exports = {
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // Disable rules handled by prettier
    'react/jsx-one-expression-per-line': 'off',

    // Disables rules we choose not to apply
    'import/prefer-default-export': 'off',
    'react/sort-comp': 'off',

    // Disables rules not compatible / useful with typescript
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],

    // Allow importing devDependencies in storybook
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.stories.{js,jsx}'] },
    ],

    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-underscore-dangle': 0,
  },
  globals: {
    it: 'readonly',
    describe: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx'],
      },
    },
    "env": {
      "browser": true
    }
  }
}
