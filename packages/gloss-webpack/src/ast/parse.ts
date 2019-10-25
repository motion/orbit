import * as babelParser from '@babel/parser'

export const parserOptions: babelParser.ParserOptions = {
  plugins: [
    'asyncGenerators',
    'classProperties',
    'dynamicImport',
    'functionBind',
    'jsx',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'decorators-legacy',
    'typescript',
    'optionalChaining',
    'nullishCoalescingOperator',
  ],
  sourceType: 'module',
}

export function parse(code: string | Buffer): any {
  return babelParser.parse(code.toString(), parserOptions)
}
