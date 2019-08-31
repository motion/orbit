import { CommandBuildOptions } from '@o/models'

import { getAppParams } from './getAppsConfig'
import { makeWebpackConfig } from './makeWebpackConfig'

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
      mode: 'production',
      // dllReferences: [defaultBaseDll],
      plugins: [
        new IgnoreIfNotNodeEntryImport({
          file: entry,
        }),
      ],
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
