import express from 'express'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

const existsInCache = (middleware, path) => {
  try {
    // console.log(
    //   'trying for',
    //   path,
    //   middleware.fileSystem['data']['Users']['nw']['projects']['motion']['orbit'],
    // )
    if (middleware.fileSystem.readFileSync(path)) {
      console.log('FUCK YEA')
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

    // let resolved = false

    // for (const [index, name] of this.configNames.entries()) {
    //   const config = this.configs[index]
    //   const compiler = Webpack(config)
    //   const publicPath = config.output.publicPath

    //   const devMiddleware = WebpackDevMiddleware(compiler, {
    //     publicPath,
    //   })
    //   const hotMiddleware = WebpackHotMiddleware(compiler, {
    //     path: `/__webpack_hmr_${name}`,
    //     log: console.log,
    //     heartBeat: 10 * 1000,
    //   })

    //   this.server.use((req, res, next) => {
    //     console.log('got one', index, req.url, resolved)

    //     if (index === 1 && resolved === false) {
    //       devMiddleware(req, res, next)
    //       return
    //     }

    //     resolved = false
    //     if (existsInCache(devMiddleware, config.output.path + req.url)) {
    //       console.log('exists in cache')
    //       resolved = true
    //       devMiddleware(req, res, next)
    //     } else {
    //       next()
    //     }
    //   })
    //   this.server.use((req, res, next) => {
    //     if (index === 1 && resolved === false) {
    //       hotMiddleware(req, res, next)
    //       return
    //     }

    //     if (existsInCache(devMiddleware, config.output.path + req.url)) {
    //       hotMiddleware(req, res, next)
    //     } else {
    //       next()
    //     }
    //   })
    // }
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
