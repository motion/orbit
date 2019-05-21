import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

export class BuildServer {
  server: WebpackDevServer

  constructor(private config) {
    const compiler = Webpack(this.config)

    this.server = new WebpackDevServer(compiler, {
      publicPath: '/',
      hot: true,
      inline: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      stats: {
        color: true,
      },
    })
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
