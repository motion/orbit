import { AppMetaDict, AppsManager, getPackageId } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, AppStatusMessage } from '@o/models'
import historyAPIFallback from 'connect-history-api-fallback'
import { Handler } from 'express'
import { parse } from 'url'
import Webpack from 'webpack'
import webpack = require('webpack')
import WebpackDevMiddleware from 'webpack-dev-middleware'

const log = new Logger('getAppMiddlewares')

type WebpackConfigObj = {
  [key: string]: webpack.Configuration
}
type WebpackAppsDesc = {
  middleware: Handler
  compiler?: webpack.Compiler
  config?: webpack.Configuration
}
export type AppBuildStatusListener = (status: AppStatusMessage) => any

export class AppMiddleware {
  configs = null
  state: WebpackAppsDesc[] = []
  statusListeners = new Set<AppBuildStatusListener>()

  constructor(private appsManager: AppsManager) {}

  update(
    configs: { [key: string]: webpack.Configuration },
    nameToAppMeta: AppMetaDict,
  ): WebpackAppsDesc[] {
    log.info(`update ${Object.keys(configs).join(', ')}`, configs)
    this.configs = configs
    this.state = this.getAppMiddlewares(configs, nameToAppMeta)
    return this.state
  }

  onStatus(callback: AppBuildStatusListener) {
    this.statusListeners.add(callback)
    return () => {
      this.statusListeners.delete(callback)
    }
  }

  private getAppMiddlewares(
    configs: WebpackConfigObj,
    nameToAppMeta: AppMetaDict,
  ): WebpackAppsDesc[] {
    const { main, ...rest } = configs
    log.info(`configs ${Object.keys(configs).join(', ')}`, configs)
    const res: WebpackAppsDesc[] = []
    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug if fixed (google)
    for (const name in rest) {
      const config = rest[name]
      const { devMiddleware, compiler } = this.getMiddleware(config, nameToAppMeta[name])
      res.push({
        middleware: resolveIfExists(devMiddleware, [config.output.path]),
        compiler,
        config,
      })
    }
    /**
     * One HMR server for everything because EventStream's don't support >5 in Chrome
     */
    const appsHotMiddleware = WebpackHotMiddleware(res.map(x => x.compiler), {
      path: '/__webpack_hmr',
      log: console.log,
      heartBeat: 10 * 1000,
    })
    res.push({
      middleware: resolveIfExists(appsHotMiddleware, res.map(x => x.config.output.path), [
        '/__webpack_hmr',
      ]),
    })
    // falls back to the main entry middleware
    if (main) {
      const { devMiddleware, compiler } = this.getMiddleware(main)
      const mainHotMiddleware = WebpackHotMiddleware([compiler], {
        path: '/__webpack_hmr_main',
        log: console.log,
        heartBeat: 10 * 1000,
      })
      res.push({
        middleware: resolveIfExists(mainHotMiddleware, [main.output.path], ['/__webpack_hmr_main']),
      })
      res.push({
        middleware: devMiddleware,
      })
      // need to have another devMiddleware  after historyAPIFallback, see:
      // https://github.com/webpack/webpack-dev-middleware/issues/88#issuecomment-252048006
      res.push({
        middleware: historyAPIFallback(),
      })
      res.push({
        middleware: devMiddleware,
      })
    }
    return res
  }

  private getMiddleware = (config: any, appMeta?: AppMeta) => {
    const compiler = Webpack(config)
    const publicPath = config.output.publicPath
    const devMiddleware = WebpackDevMiddleware(compiler, {
      publicPath,
      ...(appMeta && {
        reporter: this.createReporterForApp(appMeta),
      }),
    })
    return { devMiddleware, compiler }
  }

  private createReporterForApp(appMeta: AppMeta) {
    const send = async (message: Pick<AppStatusMessage, 'type' | 'message'>) => {
      // we have to map in a tricky way to each appId
      for (const app of this.appsManager.apps) {
        const packageId = await getPackageId(app.identifier)
        if (packageId === appMeta.packageId) {
          this.sendStatus({ appId: app.identifier, ...message })
        }
      }
    }
    return (middlewareOptions, options) => {
      // run the usual webpack reporter
      // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
      webpackDevReporter(middlewareOptions, options)
      // report our own errors
      const { state, stats } = options
      if (!state) {
        send({ type: 'info', message: `Compiling...` })
        return
      }
      if (stats.hasErrors()) {
        send({ type: 'error', message: stats.toString(middlewareOptions.stats) })
        return
      }
      send({ type: 'success', message: stats.toString(middlewareOptions.stats) })
    }
  }

  private sendStatus(message: Pick<AppStatusMessage, 'type' | 'message' | 'appId'>) {
    ;[...this.statusListeners].forEach(listener => {
      listener({
        id: `${message.appId}-build-status`,
        ...message,
      })
    })
  }
}

const existsInCache = (middleware, path: string) => {
  try {
    if (middleware.fileSystem && middleware.fileSystem.readFileSync(path)) {
      return true
    }
  } catch (err) {
    // not found in this middleware
  }
  return false
}

const resolveIfExists = (middleware, basePaths: string[], exactPaths: string[] = []) => {
  const handler: Handler = (req, res, next) => {
    const exists = basePaths.some(
      path =>
        existsInCache(middleware, path + req.url) || exactPaths.some(x => x.indexOf(req.url) === 0),
    )
    if (exists) {
      middleware(req, res, next)
    } else {
      next()
    }
  }
  return handler
}

const pathMatch = function(url, path) {
  try {
    return parse(url).pathname === path
  } catch (e) {
    return false
  }
}

/**
 * Reporter that lets us hook into webpack status messages
 */
function webpackDevReporter(middlewareOptions, options) {
  const { log, state, stats } = options

  if (state) {
    const displayStats = middlewareOptions.stats !== false

    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(stats.toString(middlewareOptions.stats))
      } else if (stats.hasWarnings()) {
        log.warn(stats.toString(middlewareOptions.stats))
      } else {
        log.info(stats.toString(middlewareOptions.stats))
      }
    }

    let message = 'App compiled successfully.'

    if (stats.hasErrors()) {
      message = 'Failed to compile.'
    } else if (stats.hasWarnings()) {
      message = 'App compiled with warnings.'
    }
    log.info(message)
  } else {
    log.info('App compiling...')
  }
}

/**
 * This is a lightly modified webpack-hot-middleware for our sakes imported here,
 * so it can be modified to support putting multiple compilers under one EventStream
 */

function WebpackHotMiddleware(compilers: webpack.Compiler[], opts) {
  opts = opts || {}
  opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log
  opts.path = opts.path || '/__webpack_hmr'
  opts.heartbeat = opts.heartbeat || 10 * 1000

  let eventStream = createEventStream(opts.heartbeat)
  let latestStats = null
  let closed = false

  for (const compiler of compilers) {
    if (compiler.hooks) {
      compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid)
      compiler.hooks.done.tap('webpack-hot-middleware', onDone)
    } else {
      compiler.plugin('invalid', onInvalid)
      compiler.plugin('done', onDone)
    }
    function onInvalid() {
      if (closed) return
      latestStats = null
      if (opts.log) opts.log('webpack building...')
      eventStream.publish({ action: 'building' })
    }
    function onDone(statsResult) {
      if (closed) return
      // Keep hold of latest stats so they can be propagated to new clients
      latestStats = statsResult
      publishStats('built', latestStats, eventStream, opts.log)
    }
  }

  function middleware(req, res, next) {
    if (closed) return next()
    if (!pathMatch(req.url, opts.path)) return next()
    eventStream.handler(req, res)
    if (latestStats) {
      publishStats('sync', latestStats, eventStream, opts.log)
    }
  }

  middleware.publish = function(payload) {
    if (closed) return
    eventStream.publish(payload)
  }

  middleware.close = function() {
    if (closed) return
    closed = true
    eventStream.close()
    eventStream = null
  }

  return middleware
}

function createEventStream(heartbeat: number) {
  var clientId = 0
  var clients = {}
  function everyClient(fn) {
    Object.keys(clients).forEach(function(id) {
      fn(clients[id])
    })
  }
  let interval = setInterval(function heartbeatTick() {
    everyClient(function(client) {
      client.write('data: \uD83D\uDC93\n\n')
    })
  }, heartbeat)
  interval.unref()
  return {
    close: function() {
      clearInterval(interval)
      everyClient(function(client) {
        if (!client.finished) client.end()
      })
      clients = {}
    },
    handler: function(req, res) {
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      }
      var isHttp1 = !(parseInt(req.httpVersion) >= 2)
      if (isHttp1) {
        req.socket.setKeepAlive(true)
        Object.assign(headers, {
          Connection: 'keep-alive',
        })
      }
      res.writeHead(200, headers)
      res.write('\n')
      var id = clientId++
      clients[id] = res
      req.on('close', function() {
        if (!res.finished) res.end()
        delete clients[id]
      })
    },
    publish: function(payload) {
      everyClient(function(client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n')
      })
    },
  }
}

function publishStats(action, statsResult, eventStream, log) {
  var stats = statsResult.toJson({
    all: false,
    cached: true,
    children: true,
    modules: true,
    timings: true,
    hash: true,
  })
  // For multi-compiler, stats will be an object with a 'children' array of stats
  var bundles = extractBundles(stats)
  bundles.forEach(function(stats) {
    var name = stats.name || ''

    // Fallback to compilation name in case of 1 bundle (if it exists)
    if (bundles.length === 1 && !name && statsResult.compilation) {
      name = statsResult.compilation.name || ''
    }

    if (log) {
      log('webpack built ' + (name ? name + ' ' : '') + stats.hash + ' in ' + stats.time + 'ms')
    }
    eventStream.publish({
      name: name,
      action: action,
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules: buildModuleMap(stats.modules),
    })
  })
}

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) return [stats]
  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) return stats.children
  // Not sure, assume single
  return [stats]
}

function buildModuleMap(modules) {
  var map = {}
  modules.forEach(function(module) {
    map[module.id] = module.name
  })
  return map
}
