import { getGlobalConfig } from '@o/config'
import { CommandBuildOptions } from '@o/models'
import { join } from 'path'

import { getAppParams } from './getAppsConfig'
import { makeWebpackConfig } from './makeWebpackConfig'

// default base dll
export let defaultBaseDll
if (process.env.NODE_ENV === 'production') {
  const Config = getGlobalConfig()
  defaultBaseDll = {
    manifest: join(Config.paths.desktopRoot, 'dist', 'orbit-manifest-base.json'),
    filepath: join(Config.paths.desktopRoot, 'dist', 'base.dll.js'),
  }
} else {
  const monoRoot = join(__dirname, '..', '..', '..', '..')
  defaultBaseDll = {
    manifest: join(monoRoot, 'example-workspace', 'dist', 'production', 'orbit-manifest-base.json'),
    filepath: join(monoRoot, 'example-workspace', 'dist', 'production', 'base.dll.js'),
  }
}

class IgnoreIfNotNodeEntryImport {
  constructor(private options: { file: string }) {}

  directDependencies = new Set<string>()

  checkIgnore = result => {
    if (!result) return result
    // if entry === file, ok
    if (result.request === this.options.file) {
      this.directDependencies = new Set()
      return result
    }
    // if issuer === file, ok if .node
    if (result.contextInfo && result.contextInfo.issuer === this.options.file) {
      if (result.request[0] === '.' && !result.request.includes('.node')) {
        result.request = '@o/kit/EmptyThing'
        return result
      }
    }
    return result
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('IgnorePlugin', nmf => {
      nmf.hooks.beforeResolve.tap('IgnorePlugin', this.checkIgnore)
    })
    compiler.hooks.contextModuleFactory.tap('IgnorePlugin', cmf => {
      cmf.hooks.beforeResolve.tap('IgnorePlugin', this.checkIgnore)
    })
  }
}

export async function getNodeAppConfig(entry: string, name: any, options: CommandBuildOptions) {
  return await makeWebpackConfig(
    getAppParams({
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'node',
      outputFile: 'index.node.js',
      watch: options.watch,
      // for non-treeshaking
      mode: 'development',
      dllReferences: [defaultBaseDll],
      // for tree-shaking...
      // mode: 'production',
      // plugins: [
      //   new IgnoreIfNotNodeEntryImport({
      //     file: entry,
      //   }),
      // ],
    }),
    {
      node: {
        __dirname: false,
        __filename: false,
      },
      externals: [
        // externalize everything but local files
        function(_context, request, callback) {
          // and our nice tree-shakeable libraries
          // WE cant do this until we can ignore non-node files from just entrypoint, loaders cant test like that
          // would have to be a webpack plugin
          if (request === '@o/kit' || request === '@o/worker-kit' || request === '@o/ui') {
            // @ts-ignore
            return callback()
          }
          const isLocal = request[0] === '.' || request === entry
          if (!isLocal) {
            return callback(null, 'commonjs ' + request)
          }
          // @ts-ignore
          callback()
        },
      ],
    },
  )
}
