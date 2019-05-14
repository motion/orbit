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
    return (req, res) => {
      for (const middleware of this.middlewares) {
        middleware(req, res)
      }
    }
  }

  async setApps(apps: AppDesc[]) {
    const next = []

    for (const app of apps) {
      let config = await makeWebpackConfig({
        projectRoot: app.path,
        mode: 'development',
      })
      let compiler = Webpack(config)
      next.push(WebpackDevMiddleware(compiler), {
        publicPath: app.publicPath,
      })
      next.push(WebpackHotMiddleware(compiler))
    }

    this.middlewares = next
  }
}
