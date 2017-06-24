module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:flowtype/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],
  plugins: ['react', 'flowtype', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      impliedStrict: true,
      classes: true,
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {
    indent: 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-unused-vars': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },
  settings: {
    'import/resolver': {
      'babel-root-import': {},
    },
  },
  globals: {
    require: true,
    module: true,
    process: true,
    React$Element: true,
    React$Children: true,
    React$Component: true,
    emit: true,
  },
}
