import { Logger } from '@o/logger'
import { AppStatusMessage } from '@o/models'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { makeWebpackConfig } from './makeWebpackConfig'

const log = new Logger('AppMiddleware')

export type AppDesc = {
  appId: number
  entry: string
  path: string
  publicPath: string
}

export type AppBuildStatusListener = (status: AppStatusMessage) => any

export class AppMiddleware {
  middlewares = []

  getMiddleware() {
    return (req, res, next) => {
      if (req.url.indexOf('/appServer') !== 0) {
        return next()
      }
      if (!this.middlewares.length || req.pathname) {
        console.log(`no middleware or empty req pathname`)
        return next()
      }
      for (const middleware of this.middlewares) {
        // have to disable next because for some reason they were sending next
        middleware(req, res, () => {})
      }
    }
  }

  // use this to report errors back to app
  createReporterForApp = (appId: number) => (middlewareOptions, options) => {
    // run the usual webpack reporter
    // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
    webpackDevReporter(middlewareOptions, options)

    // report our own errors
    const { state, stats } = options
    if (!state) {
      this.sendStatus({ appId, type: 'info', message: `Compiling...` })
      return
    }
    if (stats.hasErrors()) {
      this.sendStatus({ appId, type: 'error', message: stats.toString(middlewareOptions.stats) })
      return
    }
    this.sendStatus({ appId, type: 'success', message: stats.toString(middlewareOptions.stats) })
  }

  async setApps(apps: AppDesc[]) {
    log.info(`Setting apps: ${JSON.stringify(apps)}`)

    const next = []

    for (const app of apps) {
      const publicPath = app.publicPath

      let config = await makeWebpackConfig({
        context: app.path,
        mode: 'development',
        publicPath,
        entry: [app.entry],
        outputFile: 'bundle.js',
        output: {
          // TODO(andreypopp): sort this out, we need some custom symbol here which
          // we will communicate to Orbit
          library: 'window.OrbitAppToRun',
          libraryTarget: 'assign',
          libraryExport: 'default',
        },
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@o/kit': 'OrbitKit',
          '@o/ui': 'OrbitUI',
        },
        ignore: ['electron-log'],
      })

      log.info(
        `Compiling app at url ${publicPath} to ${config.output.path} ${config.output.filename}`,
      )

      let compiler = Webpack(config)

      next.push(
        WebpackDevMiddleware(compiler, {
          publicPath,
          reporter: this.createReporterForApp(app.appId),
        }),
      )
      next.push(
        WebpackHotMiddleware(compiler, {
          path: `${publicPath}/__webpack_hmr`,
          log: console.log,
          heartBeat: 10 * 1000,
        }),
      )
    }

    this.middlewares = next
  }
}

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
