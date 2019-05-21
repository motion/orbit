import express from 'express'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

export class BuildServer {
  server = express()

  constructor(private config) {
    const compiler = Webpack(this.config)
    const publicPath = '/'

    this.server.use(
      WebpackDevMiddleware(compiler, {
        publicPath,
      }),
    )

    this.server.use(
      WebpackHotMiddleware(compiler, {
        path: `${publicPath}/__webpack_hmr`,
        log: console.log,
        heartBeat: 10 * 1000,
      }),
    )
  }

  start() {
    this.server.listen(3999, () => {
      console.log('listening on 3999')
    })
  }
}
