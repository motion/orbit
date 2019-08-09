import { AppMetaDict, AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus } from '@o/models'
import { stringToIdentifier } from '@o/ui'
import historyAPIFallback from 'connect-history-api-fallback'
import { Handler } from 'express'
import hashObject from 'node-object-hash'
import { parse } from 'url'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import Observable from 'zen-observable'

import { AppBuildModeDict } from './WorkspaceManager'

const log = new Logger('getAppMiddlewares')

type WebpackConfigObj = {
  [key: string]: Webpack.Configuration
}
type WebpackAppsDesc = {
  name: string
  hash?: string
  middleware: Handler
  close?: Function
  compiler?: Webpack.Compiler
  config?: Webpack.Configuration
}

export class AppBuilder {
  configs = null
  running: WebpackAppsDesc[] = []
  apps: AppMeta[] = []

  private buildStatus = new Map<string, 'compiling' | 'error' | 'success'>()
  private completeFirstBuild: () => void
  private buildMode: AppBuildModeDict = {}
  completedFirstBuild: Promise<boolean>

  constructor(
    private appsManager: AppsManager,
    private buildModeObservable: Observable<AppBuildModeDict>,
  ) {
    this.completedFirstBuild = new Promise(res => {
      this.completeFirstBuild = () => res(true)
    })
    this.buildModeObservable.subscribe(next => {
      this.buildMode = next
    })
  }

  update(
    configs: { [name: string]: Webpack.Configuration },
    buildNameToAppMeta: { [name: string]: AppMeta },
  ) {
    log.verbose(`update ${Object.keys(configs).join(', ')}`, configs)
    this.configs = configs
    this.apps = Object.keys(buildNameToAppMeta).map(k => buildNameToAppMeta[k])
    this.running = this.updateAppMiddlewares(configs, buildNameToAppMeta)
  }

  updateCompletedFirstBuild = async (name: string, status: 'compiling' | 'error' | 'success') => {
    this.buildStatus.set(name, status)
    if (this.buildStatus.size === 0) {
      return
    }
    const statuses = [...this.buildStatus].map(x => x[1])
    if (statuses.every(status => status === 'success')) {
      log.verbose(`Completed initial build`)
      this.completeFirstBuild()
    }
  }

  /**
   * Resolves all requests if they are valid down the the proper app middleware
   */
  middleware: Handler = async (req, res, next) => {
    const sendIndex = async () => {
      await this.completedFirstBuild
      res.send(await this.getIndex())
    }
    // hacky way to just serve our own index.html for now
    if (req.path[1] !== '_' && req.path.indexOf('.') === -1) {
      return await sendIndex()
    }
    let fin
    for (const { middleware } of this.running) {
      fin = null
      await middleware(req, res, err => {
        fin = err || true
      })
      if (fin === null) {
        return
      }
    }
    log.verbose('no match', req.path)
    return next()
  }

  /**
   * Returns Observable for the current workspace information
   */
  observables = new Set<{ update: (next: any) => void; observable: Observable<BuildStatus[]> }>()
  observeBuildStatus() {
    const observable = new Observable<BuildStatus[]>(observer => {
      this.observables.add({
        update: (status: BuildStatus[]) => {
          observer.next(status)
        },
        observable,
      })
      // send initial status
      observer.next(this.buildStatuses)
    })
    return observable
  }

  buildStatuses: BuildStatus[] = []
  private setBuildStatus = async (status: BuildStatus) => {
    const existing = this.buildStatuses.findIndex(x => x.identifier === status.identifier)
    if (existing > -1) {
      this.buildStatuses = this.buildStatuses.map((x, i) => (i === existing ? status : x))
    } else {
      this.buildStatuses.push(status)
    }
    this.observables.forEach(({ update }) => {
      update(this.buildStatuses)
    })
  }

  private updateAppMiddlewares(
    configs: WebpackConfigObj,
    nameToAppMeta: AppMetaDict,
  ): WebpackAppsDesc[] {
    log.verbose(`configs ${Object.keys(configs).join(', ')}`, configs)

    const { main, ...rest } = configs
    let res: WebpackAppsDesc[] = []

    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug is fixed (google)
    for (const name in rest) {
      const config = rest[name]
      const devName = `${name}-dev`
      const current = this.running.find(x => x.name === devName)
      const middleware = this.getMiddleware(config, name, nameToAppMeta[name], devName)
      if (middleware === true) {
        // use last one
        res.push(current)
      } else {
        if (current && current.close) {
          current.close()
        }
        const { hash, devMiddleware, compiler } = middleware
        res.push({
          name: devName,
          hash,
          middleware: resolveIfExists(devMiddleware, [config.output.path]),
          close: () => {
            console.log('closing', name)
            devMiddleware.close()
          },
          compiler,
          config,
        })
      }
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
      name: 'apps-hot',
      middleware: resolveIfExists(appsHotMiddleware, res.map(x => x.config.output.path), [
        '/__webpack_hmr',
      ]),
    })

    // falls back to the main entry middleware
    if (main) {
      const name = 'main'
      const middleware = this.getMiddleware(main, name, undefined, name)
      if (middleware === true) {
        res = [...res, ...this.running.filter(x => x.name === name)]
      } else {
        const { hash, devMiddleware, compiler } = middleware
        const mainHotMiddleware = WebpackHotMiddleware([compiler], {
          path: '/__webpack_hmr_main',
          log: console.log,
          heartBeat: 10 * 1000,
        })
        res = [
          ...res,
          {
            name,
            hash,
            middleware: resolveIfExists(
              mainHotMiddleware,
              [main.output.path],
              ['/__webpack_hmr_main'],
            ),
          },
          {
            name,
            hash,
            middleware: devMiddleware,
          },
          // need to have another devMiddleware  after historyAPIFallback, see:
          // https://github.com/webpack/webpack-dev-middleware/issues/88#issuecomment-252048006
          {
            name,
            hash,
            middleware: historyAPIFallback(),
          },
          {
            name,
            hash,
            middleware: devMiddleware,
          },
        ]
      }
    }

    return res
  }

  private getMiddleware = (
    config: Webpack.Configuration,
    name: string,
    appMeta?: AppMeta,
    runningName?: string,
  ) => {
    const compiler = Webpack(config)
    const publicPath = config.output.publicPath

    // cache if it hasn't changed to avoid rebuilds
    const hash = hashObject({ sort: false }).hash(config)
    if (runningName) {
      const running = this.running.find(x => x.name === runningName)
      if (running) {
        if (hash === running.hash) {
          // log.verbose(`${name} config hasnt changed! dont re-run this one just return the old one`)
          return true
        } else {
          log.verbose(`${name}config has changed!`)
        }
      }
    }

    const devMiddleware = WebpackDevMiddleware(compiler, {
      publicPath,
      reporter: this.createReporterForApp(name, appMeta),
    })
    return { devMiddleware, compiler, name, hash }
  }

  private createReporterForApp(name: string, appMeta?: AppMeta) {
    // start in compiling mode
    this.updateCompletedFirstBuild(name, 'compiling')

    return (middlewareOptions, options) => {
      // run the usual webpack reporter, outputs to console
      // https://github.com/webpack/webpack-dev-middleware/blob/master/lib/reporter.js
      webpackDevReporter(middlewareOptions, options)

      const { state, stats } = options
      const status = !state ? 'compiling' : stats.hasErrors() ? 'error' : 'success'

      // keep internal track of status of builds
      this.updateCompletedFirstBuild(name, status)

      // report to appStatus bus
      const identifier = appMeta ? this.appsManager.packageIdToIdentifier(appMeta.packageId) : name
      const mode = this.buildMode[appMeta.packageId]
      if (!state) {
        this.setBuildStatus({ identifier, status: 'building', mode })
        return
      }
      if (stats.hasErrors()) {
        this.setBuildStatus({
          mode,
          identifier,
          status: 'error',
          message: stats.toString(middlewareOptions.stats),
        })
        return
      }
      this.setBuildStatus({
        mode,
        identifier,
        status: 'complete',
        message: stats.toString(middlewareOptions.stats),
      })
    }
  }

  private async getIndex() {
    const isProd = Object.keys(this.buildMode).every(x => this.buildMode[x] === 'production')
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <script>
          console.time('splash')
        </script>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/png" href="./favicon.png" />
        <title>Orbit</title>
        <script>
          if (typeof require !== 'undefined') {
            window.electronRequire = require
          } else {
            window.notInElectron = true
            window.electronRequire = module => {
              return {}
            }
          }
        </script>
      </head>

      <body>
        <div id="app"></div>
        <script>
          if (window.notInElectron) {
            // easier to see what would be transparent in dev mode in browser
            document.body.style.background = '#eee'
          }
        </script>
        <script id="script_base" src="/${isProd ? 'baseProd' : 'baseDev'}.dll.js"></script>
        <script id="script_shared" src="/shared.dll.js"></script>
    ${this.apps
      .map(
        app =>
          `    <script id="script_app_${stringToIdentifier(
            app.packageId,
          )}" src="/${stringToIdentifier(app.packageId)}.${
            this.buildMode[app.packageId]
          }.dll.js"></script>`,
      )
      .join('\n')}
        <script src="/workspaceEntry.js"></script>
        <script src="/main.js"></script>
      </body>
    </html>`
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

function WebpackHotMiddleware(compilers: Webpack.Compiler[], opts) {
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
