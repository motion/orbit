import { AppMetaDict, AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, resolveObserveOne } from '@o/mediator'
import { AppBuildCommand, AppCreateWorkspaceCommand, AppDevCloseCommand, AppEntity, AppGenTypesCommand, AppInstallCommand, AppMetaCommand, AppOpenWorkspaceCommand, AppStatusModel, CallAppBitApiMethodCommand, CloseAppCommand, CommandWsOptions, WorkspaceInfo, WorkspaceInfoModel } from '@o/models'
import { Desktop } from '@o/stores'
import { decorate, ensure, react } from '@o/use-store'
import { Handler } from 'express'
import { join } from 'path'
import { getRepository } from 'typeorm'
import Observable from 'zen-observable'

import { GraphServer } from '../GraphServer'
import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'
import { getActiveSpace } from '../helpers/getActiveSpace'
import { appStatusManager } from '../managers/AppStatusManager'
import { AppMiddleware } from './AppMiddleware'
import { commandBuild } from './commandBuild'
import { commandGenTypes } from './commandGenTypes'
import { commandInstall } from './commandInstall'
import { commandWs } from './commandWs'
import { getAppsConfig } from './getAppsConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('WorkspaceManager')

@decorate
export class WorkspaceManager {
  // developingApps: AppDesc[] = []
  started = false
  workspaceVersion = 0
  options: CommandWsOptions = null
  middlewares = []
  appsManager = new AppsManager()
  appMiddleware = new AppMiddleware(this.appsManager)
  graphServer = new GraphServer()

  constructor(
    private mediatorServer: MediatorServer,
    private startOpts: { singleUseMode: boolean },
  ) {
    this.appsManager.onUpdatedAppMeta(async (appMeta: AppMetaDict) => {
      log.verbose('appsManager updating app meta', appMeta)
      const identifiers = Object.keys(appMeta)
      const space = await getActiveSpace()
      const apps = await getRepository(AppEntity).find({ where: { spaceId: space.id } })
      this.graphServer.setupGraph(apps)
      const packageIds = identifiers.map(this.appsManager.getIdentifierToPackageId)
      Desktop.setState({
        workspaceState: {
          appMeta,
          packageIds,
          identifiers,
        },
      })
    })
  }

  get directory() {
    if (!this.options) return ''
    return this.options.workspaceRoot
  }

  async setWorkspace(opts: CommandWsOptions) {
    log.info(`setWorkspace ${JSON.stringify(opts)}`)
    this.options = opts

    await this.appsManager.start({
      singleUseMode: this.startOpts.singleUseMode,
    })
    await this.buildWorkspace()

    if (!this.startOpts.singleUseMode) {
      await this.graphServer.start()
      /**
       * Sends messages between webpack and client apps so we can display status messages
       */
      this.appMiddleware.onStatus(status => {
        appStatusManager.sendMessage(status)
      })
      this.started = true
    }
  }

  middleware: Handler = async (req, res, next) => {
    const sendIndex = () => res.sendFile(join(this.directory, 'dist', 'index.html'))
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
    log.verbose('no match', req.path)
    return next()
  }

  updateWorkspace = async () => {
    this.workspaceVersion = (this.workspaceVersion + 1) % Number.MAX_SAFE_INTEGER
  }

  onNewWorkspaceVersion = react(
    () => this.workspaceVersion,
    async (_, { sleep }) => {
      ensure('this.started', this.started)
      ensure('not in single build mode', !this.options.build)
      ensure('directory', !!this.directory)
      await sleep()
      this.buildWorkspace()
    },
  )

  async buildWorkspace() {
    const appMeta = this.appsManager.appMeta
    log.info(`Start building workspace...`, this.options.build, appMeta)
    try {
      const res = await getAppsConfig(Object.keys(appMeta).map(k => appMeta[k]), this.options)
      if (!res) {
        console.error('No config')
        return
      }
      const { webpackConfigs, nameToAppMeta } = res
      if (this.options.build) {
        await webpackPromise(Object.keys(webpackConfigs).map(key => webpackConfigs[key]), {
          loud: true,
        })
      } else {
        this.middlewares = this.appMiddleware
          .update(webpackConfigs, nameToAppMeta)
          .map(x => x.middleware)
      }
    } catch (err) {
      console.error('Error running workspace', err.message, err.stack)
    }
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
      // resolveCommand(AppDevOpenCommand, async ({ projectRoot }) => {
      //   const entry = await getAppEntry(projectRoot)
      //   const appId = Object.keys(Electron.state.appWindows).length
      //   // launch new app
      //   Electron.setState({
      //     appWindows: {
      //       ...Electron.state.appWindows,
      //       [appId]: {
      //         appId,
      //         appRole: 'editing',
      //       },
      //     },
      //   })
      //   this.developingApps.push({
      //     entry,
      //     appId,
      //     path: projectRoot,
      //     publicPath: `/appServer/${appId}`,
      //   })
      //   this.appMiddleware.setApps(this.developingApps)
      //   return {
      //     type: 'success',
      //     message: 'Got app id',
      //     value: `${appId}`,
      //   } as const
      // }),
      resolveCommand(AppDevCloseCommand, async ({ appId }) => {
        return
        log.info('Removing build server', appId)
        // this.developingApps = remove(this.developingApps, x => x.appId === appId)
        // this.appMiddleware.setApps(this.developingApps)
        log.info('Removing process', appId)
        await this.mediatorServer.sendRemoteCommand(CloseAppCommand, { appId })
        log.info('Closed app', appId)
      }),
      // are both doing similar things but in different ways
      resolveCommand(AppMetaCommand, async ({ identifier }) => {
        return this.appsManager.appMeta[identifier] || null
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
