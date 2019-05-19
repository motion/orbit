import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { makeWebpackConfig } from './makeWebpackConfig'

export type AppDesc = {
  appId: number
  entry: string
  path: string
  publicPath: string
}

export class BuildServer {
  middlewares = []

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

  async setApps(apps: AppDesc[]) {
    const next = []

    for (const app of apps) {
      const publicPath = app.publicPath

      let config = await makeWebpackConfig({
        projectRoot: app.path,
        mode: 'development',
        publicPath,
        entry: app.entry,
      })

      let compiler = Webpack(config)

      next.push(
        WebpackDevMiddleware(compiler, {
          publicPath,
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
