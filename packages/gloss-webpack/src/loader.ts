import fs from 'fs-extra'
import invariant from 'invariant'
import loaderUtils from 'loader-utils'
import path from 'path'
import util from 'util'
import webpack from 'webpack'

import { extractStyles } from './ast/extractStyles'
import { CacheObject, LoaderOptions, PluginContext } from './types'

Error.stackTraceLimit = Infinity

const counter: any = Symbol.for('counter')

// for orbit stack support
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

  if (options.cacheFile && pluginContext.cacheFile !== options.cacheFile) {
    try {
      const newCacheObject: CacheObject = {}
      if (fs.existsSync(options.cacheFile)) {
        const cacheFileContents = fs.readFileSync(options.cacheFile, 'utf8')
        // create mapping of unique CSS strings to class names
        const lines = new Set<string>(cacheFileContents.trim().split('\n'))
        let lineCount = 0
        lines.forEach(line => {
          const className = '_x' + (lineCount++).toString(36)
          newCacheObject[line] = className
        })
        // set counter
        newCacheObject[counter] = lineCount
      }
      pluginContext.cacheObject = newCacheObject
    } catch (err) {
      if (err.code === 'EISDIR') {
        this.emitError(new Error('cacheFile is a directory'))
      } else {
        this.emitError(err)
      }
      // create a new cache object anyway, since the author's intent was to use a separate cache object.
      pluginContext.cacheObject = {}
    }
    pluginContext.cacheFile = options.cacheFile
  }

  const { memoryFS, cacheObject } = pluginContext

  const rv = extractStyles(
    content,
    this.resourcePath,
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
