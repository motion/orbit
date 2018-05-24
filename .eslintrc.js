module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier', 'prettier/react'],
  plugins: ['babel', 'react', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  rules: {
    indent: 'off',
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-unused-vars': 'error',
    // 'no-undef': 'off',
    'no-constant-condition': 'off',
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 'error',
    'no-case-declarations': 'off',
    'no-debugger': 'off',
    'babel/quotes': [1, 'single'],
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
    Promise: true,
    Set: true,
    Map: true,
    debug: true,
    Reflect: true,
    Proxy: true,
    Symbol: true,
  },
}
