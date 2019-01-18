module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier', 'prettier/react'],
  plugins: ['react', 'prettier'],
  parser: 'typescript-eslint-parser',
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
    'no-shadow': 'error',

    // broke in typescript-eslint-parser
    // broken for polymorphic types
    'no-dupe-class-members': 'off',
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
    electronRequire: true,
  },
}
