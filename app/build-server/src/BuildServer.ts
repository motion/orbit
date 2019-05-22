import express from 'express'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

// import WebpackDevServer from 'webpack-dev-server'
export class BuildServer {
  server = express()
  // server: WebpackDevServer

  constructor(configs: any[], configNames: string[]) {
    for (const [index, name] of configNames.entries()) {
      const config = configs[index]
      const compiler = Webpack(config)
      const publicPath = config.output.publicPath

      console.log('serving at', publicPath)

      this.server.use(
        WebpackDevMiddleware(compiler, {
          publicPath,
        }),
      )
      this.server.use(
        WebpackHotMiddleware(compiler, {
          path: `/__webpack_hmr_${name}`,
          log: console.log,
          heartBeat: 10 * 1000,
        }),
      )
    }

    // this.server = new WebpackDevServer(compiler, {
    //   publicPath: '/',
    //   hot: true,
    //   inline: true,
    //   historyApiFallback: true,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    //   stats: {
    //     color: true,
    //   },
    // })
  }

  start() {
    return new Promise(res => {
      this.server.listen(3999, 'localhost', err => {
        console.log('listening on 3999', err)
        res()
      })
    })
  }
}
