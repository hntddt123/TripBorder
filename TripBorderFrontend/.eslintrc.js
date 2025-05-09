module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'warn',
    'no-underscore-dangle': 'warn',
    'comma-dangle': 'off',
    'linebreak-style': 'warn',
    'object-curly-newline': 'off',
    'default-case': 'off',
    'object-shorthand': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-return-assign': 'warn',
    'no-unused-vars': 'warn',
    'no-param-reassign': 'warn',
    'padded-blocks': 'warn',
    'no-multiple-empty-lines': 'warn',
    'max-len': ['warn', { code: 150 }],
    'jsx-quotes': ['warn', 'prefer-single'],
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-boolean-value': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/button-has-type': 'off',
    'react/require-default-props': 'off',
    'default-param-last': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'no-restricted-globals': 'warn',
    'prefer-destructuring': 'warn',
    'no-bitwise': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: ['htmlFor'],
        controlComponents: ['input', 'select', 'textarea'],
        assert: 'either'
      }
    ],
    'import/no-extraneous-dependencies': 'off'
  }
};
