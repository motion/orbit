import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

export class BuildServer {
  server: WebpackDevServer

  constructor(private config) {
    const compiler = Webpack(this.config)

    this.server = new WebpackDevServer(compiler, {
      publicPath: '/dist/',
      hot: true,
      inline: true,
      stats: {
        color: true,
      },
    })

    // const publicPath = '/dist/'

    // this.server.use(
    //   WebpackDevMiddleware(compiler, {
    //     publicPath,
    //   }),
    // )

    // this.server.use(
    //   WebpackHotMiddleware(compiler, {
    //     path: `/__webpack_hmr`,
    //     log: console.log,
    //     heartBeat: 10 * 1000,
    //   }),
    // )
  }

  start() {
    return new Promise(res => {
      this.server.listen(3999, 'localhost', err => {
        console.log('listening on 3999', err)
        res()
      })
    })

    // return new Promise(res => {
    //   this.server.listen(3999, () => {
    //     console.log('listening on 3999')
    //     res()
    //   })
    // })
  }
}
