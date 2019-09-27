import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus, CommandWsOptions } from '@o/models'
import { decorate } from '@o/use-store'
import { debounce } from 'lodash'
import hashObject from 'node-object-hash'
import { join, relative } from 'path'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'

import { shouldRebuildApp, writeBuildInfo } from './commandBuild'

const log = new Logger('AppBuilder')

type AppBuilderProps = {
  config: webpack.Configuration
  name: string
  devName: string
  appMeta: AppMeta
  wsOptions: CommandWsOptions
  appsManager: AppsManager
  onBuildStatus: (status: BuildStatus) => any
  buildMode?: 'development' | 'production'
}

@decorate
export class AppBuilder {
  constructor(private props: AppBuilderProps) {}

  async start() {
    const { config } = this.props
    const compiler = webpack(config)
    const publicPath = config.output.publicPath
    const devMiddleware = WebpackDevMiddleware(compiler, {
      publicPath,
      reporter: await this.getReporter(),
      writeToDisk: true,
    })
    const hash = hashObject({ sort: false }).hash(config)
    return { devMiddleware, compiler, name, hash }
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
      log.debug(`writing app build info`)
      writeBuildInfo(appMeta.directory)
    }, 100)

    if (await shouldRebuildApp(appMeta.directory)) {
      // start in compiling mode
      this.props.onBuildStatus(this.getBuildStatus({ status: 'building' }))
    } else {
      // compile, but start status at success so we can serve from disk right away
      this.props.onBuildStatus(this.getBuildStatus({ status: 'complete' }))
    }

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

      this.props.onBuildStatus(
        this.getBuildStatus(
          !state
            ? {
                status: 'building',
              }
            : stats.hasErrors()
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

    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(stats.toString(middlewareOptions.stats))
      } else if (stats.hasWarnings()) {
        log.warn(stats.toString(middlewareOptions.stats))
      } else {
        log.info(stats.toString(middlewareOptions.stats))
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
