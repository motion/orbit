import express from 'express'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

const existsInCache = (middleware, path) => {
  try {
    if (middleware.fileSystem.readFileSync(path)) {
      return true
    }
  } catch {}
  return false
}

const resolveIfExists = (middleware, config) => (req, res, next) => {
  if (existsInCache(middleware, config.output.path + req.url)) {
    middleware(req, res, next)
  } else {
    next()
  }
}

const getMiddleware = (name: string, config: any) => {
  const compiler = Webpack(config)
  const publicPath = config.output.publicPath
  const devMiddleware = WebpackDevMiddleware(compiler, {
    publicPath,
  })
  const hotMiddleware = WebpackHotMiddleware(compiler, {
    path: `/__webpack_hmr_${name}`,
    log: console.log,
    heartBeat: 10 * 1000,
  })
  return { devMiddleware, hotMiddleware }
}

export class BuildServer {
  server = express()
  middlewares = []

  constructor(configs: { main: any; [key: string]: any }) {
    const { main, ...apps } = configs

    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug if fixed (google)

    // apps first, then fallback to main
    for (const name in apps) {
      const config = apps[name]
      const { devMiddleware, hotMiddleware } = getMiddleware(name, config)
      this.server.use(resolveIfExists(devMiddleware, config))
      this.server.use(resolveIfExists(hotMiddleware, config))
    }

    const { devMiddleware, hotMiddleware } = getMiddleware('main', main)
    this.server.use(devMiddleware)
    this.server.use(hotMiddleware)
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
