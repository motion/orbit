import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus, CommandWsOptions } from '@o/models'
import { decorate } from '@o/use-store'
import { stringToIdentifier } from '@o/utils'
import historyAPIFallback from 'connect-history-api-fallback'
import { Handler } from 'express'
import { Dictionary, Request } from 'express-serve-static-core'
import { readFile } from 'fs-extra'
import { chunk } from 'lodash'
import hashObject from 'node-object-hash'
import { join, relative } from 'path'
import { parse } from 'url'
import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import Observable from 'zen-observable'

import { commandBuild } from './commandBuild'
import { AppBuildConfigs, getAppsConfig } from './getAppsConfig'
import { webpackPromise } from './webpackPromise'
import { AppBuildModeDict } from './WorkspaceManager'

const log = new Logger('AppsBuilder')

/**
 * Welcome to AppsBuilder. This is an early implementation of a build system for Orbit. It:
 *
 *  1. Runs webpack for each app
 *  2. Returns a middleware for apps in dev mode
 *  3. Returns a hot middleware that handles an event-stream for HMR
 *  4. Manages the status of the builds and communicates that
 *  5. Serves the index.html and awaits builds complete before doing so
 *  6. Ensures apps are built before running watch
 *
 * What we need to do next:
 *
 *  1. We need to split this into a parent "AppsBuilder" which has a set of "AppBuilder"s
 *  2. That requires a bit better sepeartion of concerns, AppsBuilder would then:
 *     - Boot up an AppBuilder for each app
 *     - Aggregate the status of each apps build
 *     - Link the middleres together as it does now into a single resolver
 *     - Handle watching/updating the AppsBuilders
 *  3. Meanwhile each AppBuilder would take over building itself and communicating that upwards
 *  4. The final step of this refactor would be to use worker_threads to paralellize it:
 *     - AppBuilder would need to be wrapped in a function createAppBuilder()
 *     - That function would type out all the ways it communicates (message passing statuses / taking events from parent)
 *     - Then we'd workerize it and get it working in parallel
 *
 * Just wanted to note this stuff for future work, and #4 there is important to keep in mind.
 */

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
  activeAppsMeta: AppMeta[]
}

@decorate
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

  isUpdating = false
  async update({ buildMode, options, activeAppsMeta }: AppsBuilderUpdate) {
    log.info(`update()`)
    this.wsOptions = options
    if (this.isUpdating) {
      console.warn('!!!!!!!!!!!!!!!!!!!!!!!! what TODO cancel current and re-run')
      return
    }
    this.isUpdating = true

    // ensure builds have run for each app
    try {
      const buildConfigs = await getAppsConfig(activeAppsMeta, buildMode, options)
      const { clientConfigs, nodeConfigs, buildNameToAppMeta } = buildConfigs
      log.verbose(`update() ${activeAppsMeta.length}`, buildConfigs)
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

      let builds = []
      const chunks = chunk(activeAppsMeta, 2)
      for (const apps of chunks) {
        log.verbose(
          `Building apps. num chunks ${chunks.length}, cur chunk ${apps
            .map(x => x.packageId)
            .join(', ')}`,
        )
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

      if (options.action === 'run') {
        this.state = await this.updateBuild(buildConfigs)
        return
      }
    } catch (err) {
      log.error(`Error running initial builds ${err.message}\n${err.stack}`)
    } finally {
      log.info(`update() finish`)
      this.isUpdating = false
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
    log.verbose(`updateBuild() configs ${Object.keys(clientConfigs).join(', ')}`, clientConfigs)

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
        log.info(`Building node app ${name}`)
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

    log.info(`updateBuild() Finished updating node apps`)

    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug is fixed (google)
    const clientDescs: WebpackAppsDesc[] = []
    for (const name in rest) {
      console.log('name', name)
      const config = rest[name]
      const devName = `${name}-client`
      const current = this.state.find(x => x.name === devName)
      const middleware = this.getClientBuilder(config, name, buildNameToAppMeta[name], devName)
      if (middleware) {
        if (middleware === true) {
          // use last one
          clientDescs.push(current)
        } else {
          if (current && current.close) {
            current.close()
          }
          const { hash, devMiddleware, compiler } = middleware
          const appDesc = {
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
          }
          clientDescs.push(appDesc)
        }
      }
    }

    // add cleint descs to output
    res = [...res, ...clientDescs]

    /**
     * One HMR server for everything because EventStream's don't support >5 in Chrome
     */
    res.push({
      name: 'apps-hot',
      middleware: resolveIfExists(
        this.getHotMiddleware(clientDescs.map(x => x.compiler), {
          path: '/__webpack_hmr',
          log: console.log,
          heartBeat: 10 * 1000,
        }),
        clientDescs.map(x => x.config.output.path),
        ['/__webpack_hmr'],
      ),
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
      res.send(await this.getIndex(req))
    }
    // hacky way to just serve our own index.html for now
    if (req.path[1] !== '_' && req.path.indexOf('.') === -1) {
      return await sendIndex()
    }
    let fin
    for (const { middleware } of this.state) {
      if (!middleware) {
        continue
      }
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
   * Helper to resolve a promise when a build completes
   */
  async onBuildComplete(identifier: string) {
    await new Promise(res => {
      const observable = this.observeBuildStatus().subscribe(next => {
        const buildStatus = next.find(x => x.identifier === identifier)
        log.verbose(`Got build status ${buildStatus ? buildStatus.status : 'none'}`)
        if (buildStatus && buildStatus.status === 'complete') {
          observable.unsubscribe()
          res()
        }
      })
    })
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
      let identifier = name
      let entryPathRelative = ''
      if (appMeta) {
        identifier = this.appsManager.packageIdToIdentifier(appMeta.packageId) || ''
        const entryPath = join(appMeta.directory, appMeta.packageJson.main)
        entryPathRelative = relative(this.wsOptions.workspaceRoot, entryPath)
        // bugfix: local workspace apps looked like `apps/abc/main.tsx` which broke webpack expectations of moduleId
        if (entryPathRelative[0] !== '.') {
          entryPathRelative = `./${entryPathRelative}`
        }
      }

      const baseBuildStatus = {
        mode: this.buildMode[appMeta ? appMeta.packageId : 'main'],
        env: 'client',
        scriptName: name,
        entryPathRelative,
        identifier,
      } as const

      if (!state) {
        this.setBuildStatus({
          ...baseBuildStatus,
          status: 'building',
        })
      } else if (stats.hasErrors()) {
        this.setBuildStatus({
          ...baseBuildStatus,
          status: 'error',
          message: stats.toString(middlewareOptions.stats),
        })
      } else {
        this.setBuildStatus({
          ...baseBuildStatus,
          status: 'complete',
          message: stats.toString(middlewareOptions.stats),
        })
      }
    }
  }

  private async getIndex(req: Request<Dictionary<string>>) {
    log.info('getIndex', req.path)

    // const isProd = Object.keys(this.buildMode).every(x => this.buildMode[x] === 'production')
    const desktopRoot = join(require.resolve('@o/orbit-desktop'), '..', '..')
    const index = await readFile(join(desktopRoot, 'index.html'), 'utf8')
    const scriptsPre = `
    <script id="script_base" src="/shared.dll.js"></script>
    <script id="script_shared" src="/shared.dll.js"></script>
`
    const scriptsPost = `
    <script src="/main.js"></script>
`
    const getAppScriptDLL = (app: AppMeta) =>
      `    <script id="script_app_${stringToIdentifier(app.packageId)}" src="/${stringToIdentifier(
        app.packageId,
      )}.${this.buildMode[app.packageId]}.dll.js"></script>`

    if (req.path.indexOf('/chrome') > -1) {
      return index.replace('<!-- orbit-scripts -->', `${scriptsPre}${scriptsPost}`)
    } else if (req.path.indexOf('/isolate') > -1) {
      const identifier = req.path.split('/')[2]
      const packageId = this.appsManager.identifierToPackageId[identifier]
      const app = this.apps.find(x => x.packageId === packageId)
      console.log('identifier', identifier)
      return index.replace(
        '<!-- orbit-scripts -->',
        `${scriptsPre}${getAppScriptDLL(app)}${scriptsPost}`,
      )
    } else {
      return index.replace(
        '<!-- orbit-scripts -->',
        `${scriptsPre}${this.apps.map(getAppScriptDLL).join('\n')}${scriptsPost}`,
      )
    }
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
  // node only TODO fix ts types
  interval['unref']()
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
