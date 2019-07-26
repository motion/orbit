import { Logger } from '@o/logger'
import historyAPIFallback from 'connect-history-api-fallback'
import express from 'express'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

const log = new Logger('useWebpackMiddleware')

export function useWebpackMiddleware(configs: { main: any; [key: string]: any }) {
  const { main, ...apps } = configs
  const server = express()

  // you have to do it this janky ass way because webpack just isnt really great at
  // doing multi-config hmr, and this makes sure the 404 hot-update bug if fixed (google)

  // apps first only if they matching cached file
  log.info('got config main', main)
  log.info('got config apps', apps)

  for (const name in apps) {
    const config = apps[name]
    const hmrPath = `/__webpack_hmr_${name}`
    const resolvePaths = [hmrPath]
    const { devMiddleware, hotMiddleware } = getMiddleware(hmrPath, config)
    global.webpackMiddlewares[name] = { devMiddleware, hotMiddleware }
    server.use(resolveIfExists(devMiddleware, config, resolvePaths))
    server.use(resolveIfExists(hotMiddleware, config, resolvePaths))
  }

  // falls back to the main entry middleware
  const { devMiddleware, hotMiddleware } = getMiddleware('/__webpack_hmr_main', main)
  server.use(devMiddleware)
  server.use(hotMiddleware)
  global.webpackMiddlewares.main = { devMiddleware, hotMiddleware }
  server.use(historyAPIFallback())
  // need to have this one after, see:
  // https://github.com/webpack/webpack-dev-middleware/issues/88#issuecomment-252048006
  server.use(devMiddleware)

  server.listen(3999, 'localhost', () => {
    log.info('listening on 3999')
  })

  return () => {
    server.removeAllListeners()
  }
}

const global = require('global')
global.webpackMiddlewares = {}

const existsInCache = (middleware, path: string) => {
  try {
    if (middleware.fileSystem && middleware.fileSystem.readFileSync(path)) {
      return true
    }
  } catch {
    // not found in this middleware
  }
  return false
}

const resolveIfExists = (middleware, config: Webpack.Configuration, resolvePaths: string[]) => (
  req,
  res,
  next,
) => {
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
