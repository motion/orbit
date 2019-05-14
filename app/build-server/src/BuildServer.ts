import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { makeWebpackConfig } from './makeWebpackConfig'

type AppDesc = {
  path: string
  publicPath: string
}

export class BuildServer {
  middlewares = []

  getMiddleware() {
    return (req, res, next) => {
      if (!this.middlewares.length) {
        return next()
      }
      for (const middleware of this.middlewares) {
        middleware(req, res, next)
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
      })
      let compiler = Webpack(config)
      next.push(
        WebpackDevMiddleware(compiler, {
          publicPath: '/',
        }),
      )
      next.push(WebpackHotMiddleware(compiler))
    }

    this.middlewares = next
  }
}
