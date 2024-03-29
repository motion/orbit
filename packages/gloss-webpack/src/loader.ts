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
  const outDir = '.out'
  const outPath = path.join(require.resolve('gloss'), '..', '..', outDir)
  const outRelPath = `gloss/${outDir}`

  const rv = extractStyles(
    content,
    this.resourcePath,
    { outPath, outRelPath },
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
    // fs.mkdirpSync(path.dirname(filename))
    // fs.writeFileSync(filename, content)
  }

  this.callback(null, rv.js, rv.map)
}

export default glossLoader
