import fs from 'fs'
import invariant from 'invariant'
import loaderUtils from 'loader-utils'
import path from 'path'
import util from 'util'
import webpack from 'webpack'

import { extractStyles } from './ast/extractStyles'
import { LoaderOptions, PluginContext } from './types'

// for orbit stack support
Error.stackTraceLimit = Infinity
global['__DEV__'] = false

const glossLoader: webpack.loader.Loader = function(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }

  const pluginContext: PluginContext = this[Symbol.for('gloss-webpack-plugin')]
  invariant(
    pluginContext,
    'gloss-webpack-plugin must be added to the plugins array in your webpack config',
  )

  const options: LoaderOptions = loaderUtils.getOptions(this) || {}
  const { memoryFS, cacheObject } = pluginContext

  const outDir = path.join(__dirname, '..', '.out')
  try {
    fs.mkdirSync(outDir)
  } catch {}

  const rv = extractStyles(
    content,
    this.resourcePath,
    outDir,
    {
      cacheObject,
      errorCallback: (str: string, ...args: any[]) =>
        this.emitError(new Error(util.format(str, ...args))),
      warnCallback: (str: string, ...args: any[]) =>
        this.emitWarning(new Error(util.format(str, ...args))),
    },
    options,
  )

  if (rv.css.length === 0) {
    return content
  }

  for (const { filename, content } of rv.css) {
    memoryFS.mkdirpSync(path.dirname(filename))
    memoryFS.writeFileSync(filename, content)
  }

  this.callback(null, rv.js, rv.map)
}

export default glossLoader
