module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:flowtype/recommended',
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
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-unused-vars': 'error',
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 'error',
    'no-case-declarations': 'off',
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
    emit: true,
    __dirname: true,
    exports: true,
    BroadcastChannel: true,
  },
}
