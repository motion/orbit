import * as babel from '@babel/core'
import { SourceMapGenerator } from 'source-map'

import loadOptions, { PluginOptions } from './babel/loadOptions'

export type Replacement = {
  original: { start: Location; end: Location }
  length: number
}

type Location = {
  line: number
  column: number
}

type Result = {
  code: string
  sourceMap?: Object
  cssText?: string
  cssSourceMapText?: string
  dependencies?: string[]
  rules?: {
    [className: string]: {
      cssText: string
      displayName: string
      start?: Location
    }
  }
  replacements?: Replacement[]
}

type Options = {
  filename: string
  preprocessor?: Preprocessor
  outputFilename?: string
  inputSourceMap?: Object
  pluginOptions?: PluginOptions
}

export type Preprocessor =
  | 'none'
  | 'stylis'
  | ((selector: string, cssText: string) => string)
  | void

export function transform(code: string, options: Options): Result {
  // Check if the file contains `css` or `styled` words first
  // Otherwise we should skip transforming
  if (!/\b(styled|css)/.test(code)) {
    return {
      code,
      sourceMap: options.inputSourceMap,
    }
  }

  const pluginOptions = loadOptions(options.pluginOptions)

  // Parse the code first so babel uses user's babel config for parsing
  // We don't want to use user's config when transforming the code
  const ast = babel.parseSync(code, {
    ...(pluginOptions ? pluginOptions.babelOptions : null),
    filename: options.filename,
    caller: { name: 'gloss' },
  })

  const { metadata, code: transformedCode, map } = babel.transformFromAstSync(ast, code, {
    filename: options.filename,
    presets: [[require.resolve('./babel'), pluginOptions]],
    babelrc: false,
    configFile: false,
    sourceMaps: true,
    sourceFileName: options.filename,
    inputSourceMap: options.inputSourceMap,
  })

  const out = metadata['gloss']

  if (!out) {
    return {
      code,
      sourceMap: options.inputSourceMap,
    }
  }

  const { rules, replacements, dependencies } = out
  const mappings = []

  let cssText = ''

  let preprocessor

  if (typeof options.preprocessor === 'function') {
    preprocessor = options.preprocessor
  }

  Object.keys(rules).forEach((selector, index) => {
    mappings.push({
      generated: {
        line: index + 1,
        column: 0,
      },
      original: rules[selector].start,
      name: selector,
    })

    // Run each rule through stylis to support nesting
    cssText += `${preprocessor(selector, rules[selector].cssText)}\n`
  })

  return {
    code: transformedCode,
    cssText,
    rules,
    replacements,
    dependencies,
    sourceMap: map,
    get cssSourceMapText() {
      if (mappings && mappings.length) {
        const generator = new SourceMapGenerator({
          file: options.filename.replace(/\.js$/, '.css'),
        })

        mappings.forEach(mapping =>
          generator.addMapping(Object.assign({}, mapping, { source: options.filename })),
        )

        generator.setSourceContent(options.filename, code)

        return generator.toString()
      }

      return ''
    },
  }
}
