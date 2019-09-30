import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus, CommandWsOptions } from '@o/models'
import { decorate } from '@o/use-store'
import { sleep } from '@o/utils'
import { Handler } from 'express'
import { pathExists, pathExistsSync } from 'fs-extra'
import hashSum from 'hash-sum'
import { debounce } from 'lodash'
import { join, relative } from 'path'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'

import { writeBuildInfo } from './commandBuild'
import { shouldRebuildApp } from './shouldRebuildApp'

// import hashObject from 'node-object-hash'
// import produce from 'immer'
const log = new Logger('AppBuilder')

type AppBuilderProps = {
  config: webpack.Configuration
  name: string
  appMeta: AppMeta
  wsOptions: CommandWsOptions
  appsManager: AppsManager
  onBuildStatus: (status: BuildStatus) => any
  buildMode?: 'development' | 'production'
}

export type WebpackAppsDesc = {
  name: string
  hash?: string
  staticMiddleware?: Handler
  middleware?: Handler
  devMiddleware?: Handler
  close?: Function
  getCompiler?: () => webpack.Compiler | null
  config?: webpack.Configuration
}

@decorate
export class AppBuilder {
  private serveStatic = false
  state: WebpackAppsDesc

  constructor(private props: AppBuilderProps) {}

  async start(): Promise<WebpackAppsDesc> {
    const { name, config, appMeta } = this.props

    // serve existing static bundle if exists
    if (!appMeta || !(await shouldRebuildApp(appMeta.directory))) {
      if (await pathExists(this.outputBundlePath)) {
        // compile, but start status at success so we can serve from disk right away
        this.props.onBuildStatus(this.getBuildStatus({ status: 'complete' }))
        this.serveStatic = true
      }
    }

    /**
     * Were doing a delayed webpack start on serveStatic so we proxy middlewares for a bit
     */

    const hash = getConfigHash(config)
    let compiler: webpack.Compiler | null = null
    let finalDevMiddleware = null
    let finalMiddleware = null

    const middleware: Handler = (req, res, next) => {
      if (finalMiddleware) return finalMiddleware(req, res, next)
      else next()
    }
    const devMiddleware: Handler = (req, res, next) => {
      if (finalDevMiddleware) return finalDevMiddleware(req, res, next)
      else next()
    }

    const setup = async () => {
      log.verbose(`Starting webpack for ${this.props.name}`)
      compiler = webpack(config)
      const publicPath = config.output.publicPath
      finalDevMiddleware = WebpackDevMiddleware(compiler, {
        publicPath,
        reporter: await this.getReporter(),
        writeToDisk: true,
      })
      finalMiddleware = resolveIfExists(finalDevMiddleware, [config.output.path])
    }

    if (this.serveStatic) {
      sleep(4000).then(setup)
    } else {
      setup()
    }

    this.state = {
      config,
      devMiddleware,
      staticMiddleware: (req, res, next) => {
        if (this.serveStatic) {
          const assetName = req.path.slice(req.path.lastIndexOf('/') + 1)
          if (assetName.includes('.worker.js')) {
            const path = join(config.output.path, assetName)
            if (pathExistsSync(path)) {
              res.sendFile(path)
              return
            }
          }
          if (assetName === config.output.filename) {
            res.sendFile(this.outputBundlePath)
            return
          }
        }
        next()
      },
      middleware,
      close: () => {
        log.info(`closing middleware ${name}`)
        finalDevMiddleware && finalDevMiddleware.close()
      },
      getCompiler: () => compiler,
      name: this.props.name,
      hash,
    }

    return this.state
  }

  get outputBundlePath() {
    const { config } = this.props
    return join(config.output.path, config.output.filename)
  }

  private getBuildStatus({
    status,
    message,
  }: {
    status: BuildStatus['status']
    message?: string
  }): BuildStatus {
    const { name, appMeta, buildMode, wsOptions, appsManager } = this.props
    // report to appStatus bus
    let identifier = name
    let entryPathRelative = ''
    if (appMeta) {
      identifier = appsManager.packageIdToIdentifier(appMeta.packageId) || ''
      const entryPath = join(appMeta.directory, appMeta.packageJson.main)
      entryPathRelative = relative(wsOptions.workspaceRoot, entryPath)
      // bugfix: local workspace apps looked like `apps/abc/main.tsx` which broke webpack expectations of moduleId
      if (entryPathRelative[0] !== '.') {
        entryPathRelative = `./${entryPathRelative}`
      }
    }
    return {
      status,
      message: message || '',
      mode: buildMode,
      env: 'client',
      scriptName: name,
      entryPathRelative,
      identifier,
    }
  }

  private getReporter = async () => {
    const { appMeta } = this.props

    const writeAppBuildInfo = debounce(() => {
      if (appMeta) {
        log.debug(`writing app build info`)
        writeBuildInfo(appMeta.directory)
      }
    }, 100)

    // start in compiling mode
    this.props.onBuildStatus(this.getBuildStatus({ status: 'building' }))

    return (middlewareOptions, options) => {
      // run the usual webpack reporter, outputs to console
      // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
      webpackDevReporter(middlewareOptions, options)

      const { state, stats } = options
      const status = !state ? 'compiling' : stats.hasErrors() ? 'error' : 'success'

      // we did it
      if (status === 'success') {
        writeAppBuildInfo()
      }

      const hasErrors = stats && stats.hasErrors()
      const success = state && !hasErrors

      if (success) {
        // no longer need to serve from static
        this.serveStatic = false
      }

      this.props.onBuildStatus(
        this.getBuildStatus(
          !state
            ? {
                status: 'building',
              }
            : hasErrors
            ? {
                status: 'error',
                message: stats.toString(),
              }
            : {
                status: 'complete',
                message: 'Success',
              },
        ),
      )
    }
  }
}

/**
 * Reporter that lets us hook into webpack status messages
 */
function webpackDevReporter(middlewareOptions, options) {
  const { log, state, stats } = options

  if (state) {
    const displayStats = middlewareOptions.stats !== false
    const logVerbose = +process.env.LOG_LEVEL > 1

    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(stats.toString(middlewareOptions.stats))
      } else if (stats.hasWarnings()) {
        if (logVerbose) {
          log.warn(stats.toString(middlewareOptions.stats))
        } else {
          log.info(`Build finished with warnings`)
        }
      } else {
        if (logVerbose) {
          log.info(stats.toString(middlewareOptions.stats))
        } else {
          log.info(`Build finished`)
        }
      }
    }

    let message = 'App compiled successfully.'

    if (stats.hasErrors()) {
      message = 'Failed to compile.'
    } else if (stats.hasWarnings()) {
      message = 'App compiled with warnings.'
    }
    log.info(message)
  } else {
    log.info('App compiling...')
  }
}

const existsInCache = (middleware, path: string) => {
  try {
    if (middleware.fileSystem && middleware.fileSystem.readFileSync(path)) {
      return true
    }
  } catch (err) {
    // not found in this middleware
  }
  return false
}

export const resolveIfExists = (middleware, basePaths: string[], exactPaths: string[] = []) => {
  const handler: Handler = (req, res, next) => {
    const exists = basePaths.some(
      path =>
        existsInCache(middleware, path + req.url) || exactPaths.some(x => x.indexOf(req.url) === 0),
    )
    if (exists) {
      middleware(req, res, next)
    } else {
      next()
    }
  }
  return handler
}

export const getConfigHash = (config: webpack.Configuration) => {
  // node-object-hash had a bug with gloss extract statics, instead i tried hashSum and it works?
  // const withoutObjectLoaders = produce(config as any, draft => {
  //   draft.module.rules = draft.module.rules.map(x => {
  //     if (x && x.use) {
  //       return produce(x, (next, index) => {
  //         if (next && next.loader) {
  //           try {
  //             return hashObject({ sort: false }).hash(next)
  //           } catch {
  //             return hashObject({ sort: false }).hash({
  //               object: [Object.keys(next.loader), index]
  //             })
  //           }
  //         }
  //         return next
  //       })
  //     }
  //     return x
  //   })
  // })
  return hashSum(config)
}
