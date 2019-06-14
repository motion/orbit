import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import { Logger } from '@o/logger'

import { makeWebpackConfig } from './makeWebpackConfig'

const log = new Logger('AppMiddleware')

export type AppDesc = {
  appId: number
  entry: string
  path: string
  publicPath: string
}

type StatusMessage =
  | { type: 'error'; message: string }
  | { type: 'processing' }
  | { type: 'success'; message: string }

export type AppBuildStatusListener = (appId: number, status: StatusMessage) => any

export class AppMiddleware {
  middlewares = []
  statusListeners = new Set<AppBuildStatusListener>()

  getMiddleware() {
    return (req, res, next) => {
      if (req.url.indexOf('/appServer') !== 0) {
        return next()
      }
      if (!this.middlewares.length || req.pathname) {
        return next()
      }
      for (const middleware of this.middlewares) {
        // have to disable next because for some reason they were sending next
        middleware(req, res, () => {})
      }
    }
  }

  onStatus(callback: AppBuildStatusListener) {
    this.statusListeners.add(callback)
    return () => {
      this.statusListeners.delete(callback)
    }
  }

  private sendStatus(appId: number, message: StatusMessage) {
    ;[...this.statusListeners].forEach(listener => {
      listener(appId, message)
    })
  }

  // use this to report errors back to app
  // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
  createReporterForApp = (appId: number) => (middlewareOptions, options) => {
    // run the usual webpack reporter
    webpackDevReporter(middlewareOptions, options)

    // report our own errors
    const { state, stats } = options
    if (!state) {
      this.sendStatus(appId, { type: 'processing' })
      return
    }
    if (stats.hasErrors()) {
      this.sendStatus(appId, { type: 'error', message: stats.toString(middlewareOptions.stats) })
      return
    }
    this.sendStatus(appId, { type: 'success', message: stats.toString(middlewareOptions.stats) })
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

    let message = 'Compiled successfully.'

    if (stats.hasErrors()) {
      message = 'Failed to compile.'
    } else if (stats.hasWarnings()) {
      message = 'Compiled with warnings.'
    }
    log.info(message)
  } else {
    log.info('Compiling...')
  }
}
