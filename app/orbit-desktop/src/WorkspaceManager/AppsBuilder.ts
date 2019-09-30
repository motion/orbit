import { AppsManager, getWorkspaceApps } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, BuildStatus, CommandWsOptions } from '@o/models'
import { decorate } from '@o/use-store'
import { stringToIdentifier } from '@o/utils'
import historyAPIFallback from 'connect-history-api-fallback'
import { Handler } from 'express'
import { Dictionary, Request } from 'express-serve-static-core'
import { readFile } from 'fs-extra'
import { chunk } from 'lodash'
import { join } from 'path'
import Webpack from 'webpack'
import Observable from 'zen-observable'

import { AppBuilder, getConfigHash, resolveIfExists, WebpackAppsDesc } from './AppBuilder'
import { commandBuild } from './commandBuild'
import { AppBuildConfigs, getAppsConfig } from './getAppsConfig'
import { getHotMiddleware } from './getHotMiddleware'
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
 *  4. The final step of this refactor would be to use worker_threads to paralellize it:
 *     - AppBuilder would need to be wrapped in a function createAppBuilder()
 *     - That function would type out all the ways it communicates (message passing statuses / taking events from parent)
 *     - Then we'd workerize it and get it working in parallel
 *
 */

type AppsBuilderUpdate = {
  options: CommandWsOptions
  buildMode: AppBuildModeDict
}

@decorate
export class AppsBuilder {
  state: WebpackAppsDesc[] = []
  apps: AppMeta[] = []
  buildNameToAppMeta: { [name: string]: AppMeta } = {}

  wsOptions: CommandWsOptions
  private buildMode: AppBuildModeDict = {}
  private appBuilders: { [name: string]: AppBuilder } = {}
  private buildConfigs: AppBuildConfigs | null = null

  observables = new Set<{ update: (next: any) => void; observable: Observable<BuildStatus[]> }>()
  buildStatuses: BuildStatus[] = []

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
  async update({ buildMode, options }: AppsBuilderUpdate) {
    log.verbose(`update()`)
    this.wsOptions = options
    if (this.isUpdating) {
      console.warn('!!!!!!!!!!!!!!!!!!!!!!!! what TODO cancel current and re-run')
      return
    }
    this.isUpdating = true

    try {
      // first ensure base/shared dlls built first
      await getAppsConfig([], buildMode, options)
      // then ensure apps built
      const builtOnce = await this.ensureAppsBuiltOnce()
      if (!builtOnce) {
        // todo handle errors
        return
      }
      // refresh app meta
      await this.appsManager.updateAppMeta()
      // then build apps
      const appsMeta = await getWorkspaceApps(options.workspaceRoot)
      const buildConfigs = await getAppsConfig(appsMeta, buildMode, options)
      this.buildConfigs = buildConfigs
      const { clientConfigs, nodeConfigs, buildNameToAppMeta } = buildConfigs
      log.verbose(`update() ${appsMeta.length}`, buildConfigs)
      this.buildNameToAppMeta = buildNameToAppMeta
      this.apps = Object.keys(buildNameToAppMeta).map(k => buildNameToAppMeta[k])

      if (!clientConfigs && !nodeConfigs) {
        log.error('No config')
        return
      }

      // for build mode, ensure we re-run the dll builds first
      if (options.action === 'build') {
        const { base } = clientConfigs
        log.verbose(`Building ${Object.keys(clientConfigs).join(', ')}...`)
        // build base dll first to ensure it feeds into rest
        await webpackPromise([base], {
          loud: +process.env.LOG_LEVEL > 1,
        })
      }

      if (options.action === 'run') {
        this.state = await this.getBuildState(buildConfigs)
        return
      }
    } catch (err) {
      log.error(`\n\ERROR running initial builds!\n\n${err.message}\n\n${err.stack}\n\n`)
    } finally {
      log.verbose(`update() finish`)
      this.isUpdating = false
    }
  }

  private async ensureAppsBuiltOnce() {
    log.verbose(`ensureAppsBuiltOnce`)
    // ensure builds have run for each app
    let builds = []
    const chunks = chunk(await getWorkspaceApps(this.wsOptions.workspaceRoot), 2)
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
      return false
    } else {
      log.info(`Finished apps initial build, success`)
      return true
    }
  }

  /**
   * Runs every time you see a change in the apps and runs the webpack/middlewares for each.
   * Think of it like a React.render()
   * Except a bit less nice, in that we manually do shouldUpdate checks within this render
   * and if we see things that change we re-run. This could be improved by being a lot more
   * react-like in the next refactor.
   */
  private async getBuildState({
    nodeConfigs,
    clientConfigs,
    buildNameToAppMeta,
  }: AppBuildConfigs): Promise<WebpackAppsDesc[]> {
    log.verbose(`getBuildState() configs ${Object.keys(clientConfigs).join(', ')}`, clientConfigs)

    let res: WebpackAppsDesc[] = []

    // manage node compilers
    log.info(`\n\n\nWARNING DISABLING NODE PRE BUILD FOR NOW, RE ENABLE \n\n\n`)
    nodeConfigs
    // for (const name in nodeConfigs) {
    //   const config = nodeConfigs[name]
    //   const runningName = `${name}-node`
    //   const { running, hash, hasChanged } = this.getRunningApp(runningName, config)
    //   if (hasChanged === false) {
    //     res.push(running)
    //   } else {
    //     if (running && running.close) {
    //       running.close()
    //     }
    //     log.info(`Building node app ${name}`)
    //     const packer = await webpackPromise([config], { loud: true })
    //     if (packer.type !== 'watch') {
    //       throw new Error(`Shouldn't ever get here`)
    //     }
    //     res.push({
    //       name: runningName,
    //       hash,
    //       config,
    //       watchingCompiler: packer.compiler,
    //       close: () => {
    //         packer.compiler.close(() => {
    //           log.verbose(`Closed node compiler ${name}`)
    //         })
    //       },
    //     })
    //   }
    // }

    log.verbose(`getBuildState() Finished updating node apps`)

    // you have to do it this janky ass way because webpack just isnt really great at
    // doing multi-config hmr, and this makes sure the 404 hot-update bug is fixed (google)
    let clientDescs: WebpackAppsDesc[] = []
    let mainDescs: WebpackAppsDesc[] = []

    await Promise.all(
      Object.keys(clientConfigs).map(async name => {
        const isMain = name === 'main'
        const config = clientConfigs[name]
        const { hasChanged } = this.getRunningApp(name, config)
        if (!hasChanged) {
          const existing = this.state.filter(x => x.name === name)
          if (isMain) {
            mainDescs = existing
          } else {
            clientDescs = [...clientDescs, ...existing]
          }
        } else {
          const appMeta = buildNameToAppMeta[name]
          const appBuilder = new AppBuilder({
            config,
            name,
            buildMode: appMeta
              ? this.buildMode[appMeta.packageId]
              : this.wsOptions.dev
              ? 'development'
              : 'production',
            appMeta,
            wsOptions: this.wsOptions,
            appsManager: this.appsManager,
            onBuildStatus: this.onBuildStatus,
          })
          this.appBuilders[name] = appBuilder
          const info = await appBuilder.start()

          if (!isMain) {
            clientDescs = [...clientDescs, { ...info, middleware: info.staticMiddleware }, info]
          } else {
            const { config, hash, devMiddleware, staticMiddleware, getCompiler } = info
            const mainHotMiddleware = getHotMiddleware([getCompiler], {
              path: '/__webpack_hmr_main',
              log: console.log,
              heartBeat: 10 * 1000,
            })
            mainDescs = [
              {
                name,
                hash,
                middleware: staticMiddleware,
              },
              {
                name,
                hash,
                middleware: resolveIfExists(
                  mainHotMiddleware,
                  [config.output.path],
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
      }),
    )

    // add client descs to output
    res = [...res, ...clientDescs]

    // then add one HMR server for everything because EventStream's don't support >5 in Chrome
    const clientDevDescs = clientDescs.filter(x => x.staticMiddleware !== x.middleware)
    res.push({
      name: 'apps-hot',
      middleware: resolveIfExists(
        getHotMiddleware(clientDevDescs.map(x => x.getCompiler), {
          path: '/__webpack_hmr',
          log: console.log,
          heartBeat: 10 * 1000,
        }),
        clientDevDescs.map(x => x.config.output.path),
        ['/__webpack_hmr'],
      ),
    })

    // then add main descs last
    res = [...res, ...mainDescs]

    return res
  }

  onBuildStatus = (status: BuildStatus) => {
    const existing = this.buildStatuses.findIndex(x => x.identifier === status.identifier)
    if (existing > -1) {
      this.buildStatuses = this.buildStatuses.map((x, i) => (i === existing ? status : x))
    } else {
      this.buildStatuses.push(status)
    }
    this.observables.forEach(({ update }) => {
      update(this.buildStatuses)
    })
    if (!this.buildConfigs) return
    const clientConfigs = Object.keys(this.buildConfigs.clientConfigs).map(
      k => this.buildConfigs.clientConfigs[k].name,
    )
    if (clientConfigs.length !== this.buildStatuses.length) {
      // not setup yet
      return
    }
    if (this.buildStatuses.every(x => x.status === 'complete')) {
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

  private getRunningApp(name: string, config: Webpack.Configuration) {
    const hash = getConfigHash(config)
    if (name) {
      const running = this.state.find(x => x.name === name)
      if (running) {
        if (hash === running.hash) {
          log.debug(`${name} config hasnt changed! dont re-run this one just return the old one`)
          return { hash, running, hasChanged: false }
        } else {
          log.verbose(`${name}config has changed! ${running.hash} vs ${hash}`)
          return { hash, running, hasChanged: true }
        }
      }
    }
    return { hash, running: null, hasChanged: true }
  }

  private async getIndex(req: Request<Dictionary<string>>) {
    log.verbose('getIndex', req.path)

    const desktopRoot = join(require.resolve('@o/orbit-desktop'), '..', '..')
    const index = await readFile(join(desktopRoot, 'index.html'), 'utf8')
    const scriptsPre = `
    <script defer id="script_base" src="/base.dll.js"></script>
    <script defer id="script_shared" src="/shared.dll.js"></script>
`
    const scriptsPost = `
    <script defer src="/main.js"></script>
`
    const getAppScriptDLL = (app: AppMeta) =>
      `    <script defer id="script_app_${stringToIdentifier(
        app.packageId,
      )}" src="/${stringToIdentifier(app.packageId)}.${
        this.buildMode[app.packageId]
      }.dll.js"></script>`

    if (req.path.indexOf('/chrome') > -1) {
      return index.replace('<!-- orbit-scripts -->', `${scriptsPre}${scriptsPost}`)
    } else if (req.path.indexOf('/isolate') > -1) {
      const identifier = req.path.split('/')[2]
      const packageId = this.appsManager.identifierToPackageId[identifier]
      const app = this.apps.find(x => x.packageId === packageId)
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
}
