import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus, CommandWsOptions } from '@o/models'
import { stringToIdentifier } from '@o/utils'
import historyAPIFallback from 'connect-history-api-fallback'
import { Handler } from 'express'
import { readFile } from 'fs-extra'
import { chunk } from 'lodash'
import hashObject from 'node-object-hash'
import { join } from 'path'
import { parse } from 'url'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import Observable from 'zen-observable'

import { commandBuild } from './commandBuild'
import { AppBuildConfigs, getAppsConfig } from './getAppsConfig'
import { webpackPromise } from './webpackPromise'
import { AppBuildModeDict } from './WorkspaceManager'

const log = new Logger('AppsBuilder')

type WebpackAppsDesc = {
  name: string
  hash?: string
  middleware?: Handler
  devMiddleware?: Handler
  close?: Function
  compiler?: Webpack.Compiler
  watchingCompiler?: Webpack.MultiWatching
  config?: Webpack.Configuration
}

type AppsBuilderUpdate = {
  options: CommandWsOptions
  buildMode: AppBuildModeDict
  activeApps: AppMeta[]
}

export class AppsBuilder {
  state: WebpackAppsDesc[] = []
  apps: AppMeta[] = []
  buildNameToAppMeta: { [name: string]: AppMeta } = {}

  wsOptions: CommandWsOptions
  private buildStatus = new Map<string, 'compiling' | 'error' | 'success'>()
  private buildMode: AppBuildModeDict = {}

  // used for tracking if we're finished with building all apps once
  // prevent serving index.html for example until all done
  private completeFirstBuild: () => void
  completedFirstBuild: Promise<boolean>

  constructor(
    private appsManager: AppsManager,
    private buildModeObservable: Observable<AppBuildModeDict>,
  ) {
    this.completedFirstBuild = new Promise(res => {
      this.completeFirstBuild = () => res(true)
    })
    this.buildModeObservable.subscribe(next => {
      if (next) {
        this.buildMode = next
      }
    })
  }

  async update({ buildMode, options, activeApps }: AppsBuilderUpdate) {
    this.wsOptions = options

    const buildConfigs = await getAppsConfig(activeApps, buildMode, options)
    const { clientConfigs, nodeConfigs, buildNameToAppMeta } = buildConfigs
    log.verbose(`update() ${activeApps.length}`, buildConfigs)
    this.buildNameToAppMeta = buildNameToAppMeta
    this.apps = Object.keys(buildNameToAppMeta).map(k => buildNameToAppMeta[k])

    if (!clientConfigs && !nodeConfigs) {
      log.error('No config')
      return
    }

    // for build mode, ensure we re-run the dll builds first
    if (options.action === 'build') {
      const { base } = clientConfigs
      log.info(`Building ${Object.keys(clientConfigs).join(', ')}...`)
      // build base dll first to ensure it feeds into rest
      await webpackPromise([base], {
        loud: true,
      })
    }

    // ensure builds have run for each app
    try {
      let builds = []
      for (const apps of chunk(activeApps, Math.max(1, require('os').cpus() - 1))) {
        builds = [
          ...builds,
          ...(await Promise.all(
            apps.map(async app => {
              return await commandBuild({
                projectRoot: app.directory,
                // dont force, were just ensureing its initially built once
                force: false,
              })
            }),
          )),
        ]
      }
      if (builds.some(x => x.type === 'error')) {
        log.error(
          `Finished apps initial build, error running initial builds of apps:\n${builds
            .filter(x => x.type === 'error')
            .map(x => ` - ${x.message}`)
            .join('\n')}`,
        )
      } else {
        log.info(`Finished apps initial build, success`)
      }
    } catch (err) {
      log.error(`Error running initial builds ${err.message}\n${err.stack}`)
    }

    if (options.action === 'run') {
      this.state = await this.updateBuild(buildConfigs)
      return
    }
  }

  /**
   * Runs every time you see a change in the apps and runs the webpack/middlewares for each.
   * Think of it like a React.render()
   * Except a bit less nice, in that we manually do shouldUpdate checks within this render
   * and if we see things that change we re-run. This could be improved by being a lot more
   * react-like in the next refactor.
   */
  private async updateBuild({
    nodeConfigs,
    clientConfigs,
    buildNameToAppMeta,
  }: AppBuildConfigs): Promise<WebpackAppsDesc[]> {
    log.verbose(`configs ${Object.keys(clientConfigs).join(', ')}`, clientConfigs)

    const { main, ...rest } = clientConfigs
    let res: WebpackAppsDesc[] = []

    // manage node compilers
    for (const name in nodeConfigs) {
      const config = nodeConfigs[name]
      const runningName = `${name}-node`
      const { running, hash, hasChanged } = this.getRunningApp(runningName, config)
      if (hasChanged === false) {
        res.push(running)
      } else {
        if (running && running.close) {
          running.close()
        }
        const packer = await webpackPromise([config], { loud: true })
        if (packer.type !== 'watch') {
          throw new Error(`Shouldn't ever get here`)
        }
        res.push({
          name: runningName,
          hash,
          config,
          watchingCompiler: packer.compiler,
          close: () => {
            packer.compiler.close(() => {
              log.verbose(`Closed node compiler ${name}`)
            })
          },
        })
      }
    }

    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug is fixed (google)
    for (const name in rest) {
      const config = rest[name]
      const devName = `${name}-client`
      const current = this.state.find(x => x.name === devName)
      const middleware = this.getClientBuilder(config, name, buildNameToAppMeta[name], devName)
      if (middleware) {
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
            devMiddleware,
            middleware: resolveIfExists(devMiddleware, [config.output.path]),
            close: () => {
              log.info(`closing middleware ${name}`)
              devMiddleware.close()
            },
            compiler,
            config,
          })
        }
      }
    }

    /**
     * One HMR server for everything because EventStream's don't support >5 in Chrome
     */
    const appsHotMiddleware = this.getHotMiddleware(res.map(x => x.compiler), {
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
      const middleware = this.getClientBuilder(main, name, undefined, name)
      if (middleware) {
        if (middleware === true) {
          res = [...res, ...this.state.filter(x => x.name === name)]
        } else {
          const { hash, devMiddleware, compiler } = middleware
          const mainHotMiddleware = this.getHotMiddleware([compiler], {
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
              devMiddleware,
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
              devMiddleware,
              middleware: devMiddleware,
            },
          ]
        }
      }
    }

    return res
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
    for (const { middleware } of this.state) {
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

  private getConfigHash(config: Webpack.Configuration) {
    return hashObject({ sort: false }).hash(config)
  }

  private getRunningApp(name: string, config: Webpack.Configuration) {
    const hash = this.getConfigHash(config)
    if (name) {
      const running = this.state.find(x => x.name === name)
      if (running) {
        if (hash === running.hash) {
          // log.verbose(`${name} config hasnt changed! dont re-run this one just return the old one`)
          return { hash, running, hasChanged: false }
        } else {
          log.verbose(`${name}config has changed!`)
          return { hash, running, hasChanged: true }
        }
      }
    }
    return { hash, running: null, hasChanged: true }
  }

  private getClientBuilder = (
    config: Webpack.Configuration,
    name: string,
    appMeta?: AppMeta,
    runningName?: string,
  ) => {
    try {
      // cache if it hasn't changed to avoid rebuilds
      const { hash, hasChanged } = this.getRunningApp(runningName, config)
      if (hasChanged === false) {
        return true
      }

      const compiler = Webpack(config)
      const publicPath = config.output.publicPath
      const devMiddleware = WebpackDevMiddleware(compiler, {
        publicPath,
        reporter: this.createReporterForApp(name, appMeta),
      })
      return { devMiddleware, compiler, name, hash }
    } catch (err) {
      log.error(
        `${err.message}\n${err.stack}\n\nWebpackConfig:\n${JSON.stringify(config, null, 2)}`,
      )
      return null
    }
  }

  private createReporterForApp = (name: string, appMeta?: AppMeta) => {
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
      const mode = this.buildMode[appMeta ? appMeta.packageId : 'main']

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
    // const isProd = Object.keys(this.buildMode).every(x => this.buildMode[x] === 'production')
    const desktopRoot = join(require.resolve('@o/orbit-desktop'), '..', '..')
    const index = await readFile(join(desktopRoot, 'index.html'), 'utf8')
    const scripts = `
    <script id="script_base" src="/baseDev.dll.js"></script>
    <script id="script_shared" src="/shared.dll.js"></script>
${this.apps
  .map(
    app =>
      `    <script id="script_app_${stringToIdentifier(app.packageId)}" src="/${stringToIdentifier(
        app.packageId,
      )}.${this.buildMode[app.packageId]}.dll.js"></script>`,
  )
  .join('\n')}
    <script src="/main.js"></script>
`
    return index.replace('<!-- orbit-scripts -->', scripts)
  }

  /**
   * This is a lightly modified webpack-hot-middleware for our sakes imported here,
   * so it can be modified to support putting multiple compilers under one EventStream.
   */
  eventStreams = {}
  getHotMiddleware(
    compilers: Webpack.Compiler[],
    opts: { path: string; log: Function; heartBeat: number },
  ) {
    opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log
    opts.path = opts.path || '/__webpack_hmr'
    // re-use existing event stream even if we re-run getHotMiddleware
    this.eventStreams[opts.path] =
      this.eventStreams[opts.path] || createEventStream(opts.heartBeat || 10 * 1000)
    const eventStream = this.eventStreams[opts.path]

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

    middleware.publish = payload => {
      if (closed) return
      eventStream.publish(payload)
    }

    middleware.close = () => {
      if (closed) return
      log.info(`Closing hot middleware... shouldnt happen`)
      closed = true
      eventStream.close()
      delete this.eventStreams[opts.path]
    }

    return middleware
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
