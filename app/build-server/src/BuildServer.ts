import historyAPIFallback from 'connect-history-api-fallback'
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

const resolveIfExists = (middleware, config, resolvePaths) => (req, res, next) => {
  const isInResolvePaths = resolvePaths.indexOf(req.url) > -1
  if (isInResolvePaths || existsInCache(middleware, config.output.path + req.url)) {
    middleware(req, res, next)
  } else {
    next()
  }
}

const getMiddleware = (hmrPath: string, config: any) => {
  const compiler = Webpack(config)
  const publicPath = config.output.publicPath
  const devMiddleware = WebpackDevMiddleware(compiler, {
    publicPath,
  })
  const hotMiddleware = WebpackHotMiddleware(compiler, {
    path: hmrPath,
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

    // apps first only if they matching cached file
    for (const name in apps) {
      const config = apps[name]
      const hmrPath = `/__webpack_hmr_${name}`
      const resolvePaths = [hmrPath]
      const { devMiddleware, hotMiddleware } = getMiddleware(hmrPath, config)
      this.server.use(resolveIfExists(devMiddleware, config, resolvePaths))
      this.server.use(resolveIfExists(hotMiddleware, config, resolvePaths))
    }

    // falls back to the main entry middleware
    const { devMiddleware, hotMiddleware } = getMiddleware('/__webpack_hmr_main', main)
    this.server.use(devMiddleware)
    this.server.use(hotMiddleware)
    this.server.use(historyAPIFallback())
    // need to have this one after, see:
    // https://github.com/webpack/webpack-dev-middleware/issues/88#issuecomment-252048006
    this.server.use(devMiddleware)
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
