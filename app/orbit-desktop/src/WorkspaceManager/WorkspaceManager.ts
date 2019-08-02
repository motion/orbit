import {
  AppMetaDict,
  AppsManager,
  getBuildInfo,
  getWorkspaceApps,
  updateWorkspacePackageIds,
} from '@o/apps-manager'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, resolveObserveOne } from '@o/mediator'
import {
  AppBuildCommand,
  AppCreateWorkspaceCommand,
  AppDevCloseCommand,
  AppDevOpenCommand,
  AppEntity,
  AppGenTypesCommand,
  AppGetWorkspaceAppsCommand,
  AppInstallCommand,
  AppMeta,
  AppMetaCommand,
  AppOpenWorkspaceCommand,
  AppStatusMessage,
  AppStatusModel,
  CallAppBitApiMethodCommand,
  CloseAppCommand,
  CommandWsOptions,
  WorkspaceInfo,
  WorkspaceInfoModel,
} from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { decorate, ensure, react } from '@o/use-store'
import { watch } from 'chokidar'
import { Handler } from 'express'
import { debounce, isEqual, remove } from 'lodash'
import { join } from 'path'
import { getRepository } from 'typeorm'
import Observable from 'zen-observable'

import { GraphServer } from '../GraphServer'
import { getActiveSpace } from '../helpers/getActiveSpace'
import { appStatusManager } from '../managers/AppStatusManager'
import { AppDesc } from './AppMiddleware'
import { commandBuild, getAppEntry } from './commandBuild'
import { commandGenTypes } from './commandGenTypes'
import { commandInstall } from './commandInstall'
import { commandWs } from './commandWs'
import { findOrCreateWorkspace } from './findOrCreateWorkspace'
import { cleanString, getAppsConfig } from './getAppsConfig'
import { useWebpackMiddleware } from './useWebpackMiddleware'
import { webpackPromise } from './webpackPromise'

const log = new Logger('WorkspaceManager')

export type AppBuildStatusListener = (status: AppStatusMessage) => any
type Disposable = Set<{ id: string; dispose: Function }>
const dispose = (x: Disposable, id: string) => x.forEach(x => x.id === id && x.dispose())

@decorate
export class WorkspaceManager {
  developingApps: AppDesc[] = []
  appsMeta: AppMeta[] = []
  workspaceVersion = 0
  directory = ''
  options: CommandWsOptions
  appWatchers: Disposable = new Set<{ id: string; dispose: Function }>()
  middlewares = []

  appsManager = new AppsManager()
  graphServer = new GraphServer()

  constructor(private mediatorServer: MediatorServer) {
    this.appsManager.onUpdatedApps(this.handleUpdatedApps)
  }

  middleware: Handler = async (req, res, next) => {
    const sendIndex = () => res.sendfile(join(this.directory, 'dist', 'index.html'))
    // hacky way to just serve our own index.html for now
    if (req.path[1] !== '_' && req.path.indexOf('.') === -1) {
      return sendIndex()
    }

    let fin
    for (const middleware of this.middlewares) {
      fin = null
      await middleware(req, res, err => {
        fin = err || true
      })
      if (fin === null) {
        return
      }
    }
    // this is the last middleware, catch everything else and serve index
    console.log('nothing happened?', req.path)
    return next()
  }

  async start(opts: { singleUseMode: boolean }) {
    if (!opts.singleUseMode) {
      await this.appsManager.start()
      await this.graphServer.start()
      this.onWorkspaceChange()
      // this.appMiddleware.onStatus(status => {
      //   appStatusManager.sendMessage(status)
      // })
    }
  }

  handleUpdatedApps = async (appMeta: AppMetaDict) => {
    log.verbose('appsManager updating app meta', appMeta)
    const identifiers = Object.keys(appMeta)
    const space = await getActiveSpace()
    const apps = await getRepository(AppEntity).find({ where: { spaceId: space.id } })
    this.graphServer.setupGraph(apps)
    const packageIds = identifiers.map(this.appsManager.getIdentifierToPackageId)
    Desktop.setState({
      workspaceState: {
        packageIds,
        identifiers,
      },
    })
  }

  watchWorkspace = react(
    () => this.directory,
    (directory, { useEffect }) => {
      ensure('directory', !!directory)
      useEffect(() => {
        let watcher = watch(this.directory, {
          persistent: true,
          // only watch top level
          depth: 0,
        })
        watcher.on('change', this.onWorkspaceChange)
        return () => {
          watcher.close()
        }
      })
    },
  )

  setWorkspace(opts: CommandWsOptions) {
    log.info(`setWorkspace ${JSON.stringify(opts)}`)
    this.directory = opts.workspaceRoot
    this.options = opts
    this.updateWorkspace()
  }

  updateWorkspace = async () => {
    this.workspaceVersion = (this.workspaceVersion + 1) % Number.MAX_SAFE_INTEGER
  }

  onNewWorkspaceVersion = react(
    () => [this.directory, this.workspaceVersion],
    async ([directory], { sleep, when }) => {
      await when(() => !!this.options)
      ensure('not in single build mode', !this.options.build)
      ensure('directory', !!directory)
      await sleep()
      this.buildWorkspace()
    },
  )

  async buildWorkspace() {
    await this.updateApps()
    log.info(`buildWorkspace ${this.appsMeta.length}`)
    try {
      Desktop.setState({
        workspaceState: {
          appImportNames: this.appsMeta.map(app => cleanString(app.packageId)),
        },
      })
      const config = await getAppsConfig(this.directory, this.appsMeta, this.options)
      if (!config) {
        console.error('No config')
        return
      }
      if (this.options.build) {
        await webpackPromise(Object.keys(config).map(key => config[key]), { loud: true })
      } else {
        this.middlewares = useWebpackMiddleware(config)
      }
      await updateWorkspacePackageIds(this.directory)
    } catch (err) {
      console.error('Error running workspace', err.message, err.stack)
    }
  }

  private onWorkspaceChange = debounce(this.updateWorkspace, 50)

  async updateApps() {
    const appsMeta = await getWorkspaceApps(this.directory)
    if (!isEqual(appsMeta, this.appsMeta)) {
      // remove old
      for (const app of this.appsMeta) {
        if (appsMeta.some(x => x.packageId === app.packageId) === false) {
          dispose(this.appWatchers, app.packageId)
        }
      }
      // add new
      for (const app of appsMeta) {
        if (this.appsMeta.some(x => x.packageId === app.packageId) === false) {
          // watch app for changes to build buildInfo
          this.addAppWatcher(app)
        }
      }
      this.appsMeta = appsMeta
      // easy to debug
      Desktop.setState({
        workspaceState: {
          appsMeta,
        },
      })
    }
  }

  /**
   * For now, this just watches and builds the app
   *
   *   TODO really this shouldn't really be a watcher here, probably just put it in command-build
   *        and have command-build just use webpack to watch and build everyting necessary.
   *
   */
  private async addAppWatcher(app: AppMeta) {
    const entry = await getAppEntry(app.directory)
    log.verbose(`Adding app watcher ${app.packageId} ${entry}`)
    // watch just the entry file to update buildInfo.json/appEntry.js
    let watcher = watch(entry, {
      persistent: true,
      awaitWriteFinish: true,
    })

    const buildAppInfo = () => {
      console.log('should build app info')
      // log.info(`buildAppInfo ${app.packageId}`)
      // bundleApp(entry, {
      //   projectRoot: app.directory,
      // })
    }

    watcher.on('change', debounce(buildAppInfo, 100))

    // build once if not built yet
    if (!(await getBuildInfo(app.directory))) {
      buildAppInfo()
    }

    this.appWatchers.add({
      id: app.packageId,
      dispose: () => {
        watcher.close()
      },
    })
  }

  /**
   * Returns Observable for the current workspace information
   */
  observables = new Set<{ update: (next: any) => void; observable: Observable<WorkspaceInfo> }>()
  observe() {
    const observable = new Observable<WorkspaceInfo>(observer => {
      this.observables.add({
        update: (status: WorkspaceInfo) => {
          observer.next(status)
        },
        observable,
      })
      // start with empty
      observer.next(null)
    })
    return observable
  }

  /**
   * For external commands, this lets the CLI call various commands in here,
   * as well as the client apps if need be.
   */
  getResolvers() {
    return [
      resolveObserveOne(WorkspaceInfoModel, () => {
        return this.observe()
      }),
      resolveObserveOne(AppStatusModel, args => {
        return appStatusManager.observe(args.appId)
      }),
      resolveCommand(AppCreateWorkspaceCommand, async props => {
        await findOrCreateWorkspace(props)
        return true
      }),
      resolveCommand(AppOpenWorkspaceCommand, async options => {
        return await commandWs(options, this)
      }),
      resolveCommand(AppInstallCommand, commandInstall),
      resolveCommand(AppBuildCommand, commandBuild),
      resolveCommand(AppGenTypesCommand, commandGenTypes),
      resolveCommand(AppDevOpenCommand, async ({ projectRoot }) => {
        const entry = await getAppEntry(projectRoot)
        const appId = Object.keys(Electron.state.appWindows).length
        // launch new app
        Electron.setState({
          appWindows: {
            ...Electron.state.appWindows,
            [appId]: {
              appId,
              appRole: 'editing',
            },
          },
        })
        this.developingApps.push({
          entry,
          appId,
          path: projectRoot,
          publicPath: `/appServer/${appId}`,
        })
        // this.appMiddleware.setApps(this.developingApps)
        return {
          type: 'success',
          message: 'Got app id',
          value: `${appId}`,
        } as const
      }),
      resolveCommand(AppDevCloseCommand, async ({ appId }) => {
        log.info('Removing build server', appId)
        this.developingApps = remove(this.developingApps, x => x.appId === appId)
        // this.appMiddleware.setApps(this.developingApps)
        log.info('Removing process', appId)
        await this.mediatorServer.sendRemoteCommand(CloseAppCommand, { appId })
        log.info('Closed app', appId)
      }),
      // TODO these two commands (AppMetaCommand, AppGetWorkspaceAppsCommand)
      // are both doing similar things but in different ways
      resolveCommand(AppMetaCommand, async ({ identifier }) => {
        return this.appsManager.appMeta[identifier] || null
      }),
      resolveCommand(AppGetWorkspaceAppsCommand, async () => {
        return this.appsMeta
      }),
      resolveCommand(CallAppBitApiMethodCommand, async ({ appId, appIdentifier, method, args }) => {
        const app = await getRepository(AppEntity).findOneOrFail(appId)
        const api = this.appsManager.nodeAppDefinitions.find(x => x.id === appIdentifier).api(app)
        if (!api) throw new Error(`API for app "${appId}" is invalid`)
        if (!api[method]) throw new Error(`No method "${method}" was found in the ${appId}" app`)
        log.info(
          `Calling api for app ${appIdentifier} id ${appId} method ${method} args ${JSON.stringify(
            args,
          )}`,
        )
        return await Promise.resolve(api[method](...args))
      }),
    ]
  }
}
