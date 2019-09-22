import * as babelParser from '@babel/parser'

export function parse(code: string | Buffer, plugins: babelParser.ParserPlugin[] = []): any {
  return babelParser.parse(code.toString(), {
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
      ...plugins,
    ],
    sourceType: 'module',
  })
}
