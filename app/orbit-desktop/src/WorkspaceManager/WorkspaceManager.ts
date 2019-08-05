import { AppsManager, getAppMeta } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, resolveObserveOne } from '@o/mediator'
import { AppCreateWorkspaceCommand, AppDevCloseCommand, AppDevOpenCommand, AppEntity, AppMeta, AppMetaCommand, AppOpenWorkspaceCommand, AppStatusModel, CallAppBitApiMethodCommand, CloseAppCommand, CommandWsOptions, WorkspaceInfo, WorkspaceInfoModel } from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { decorate, react } from '@o/use-store'
import { Handler } from 'express'
import { remove } from 'lodash'
import { join } from 'path'
import { getRepository } from 'typeorm'
import Observable from 'zen-observable'

import { GraphServer } from '../GraphServer'
import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'
import { getActiveSpace } from '../helpers/getActiveSpace'
import { appStatusManager } from '../managers/AppStatusManager'
import { AppMiddleware } from './AppMiddleware'
import { resolveAppBuildCommand } from './commandBuild'
import { resolveAppGenTypesCommand } from './commandGenTypes'
import { resolveAppInstallCommand } from './commandInstall'
import { commandWs } from './commandWs'
import { getAppsConfig } from './getAppsConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('WorkspaceManager')

@decorate
export class WorkspaceManager {
  developingApps: (AppMeta & { appId?: number })[] = []
  started = false
  workspaceVersion = 0
  options: CommandWsOptions = {
    build: false,
    workspaceRoot: '',
  }
  middlewares = []
  appsManager = new AppsManager()
  appMiddleware = new AppMiddleware(this.appsManager)
  graphServer = new GraphServer()

  constructor(
    private mediatorServer: MediatorServer,
    private startOpts: { singleUseMode: boolean },
  ) {}

  async start() {
    await this.appsManager.start({
      singleUseMode: this.startOpts.singleUseMode,
    })
    /**
     * Sends messages between webpack and client apps so we can display status messages
     */
    this.appMiddleware.onStatus(status => {
      appStatusManager.sendMessage(status)
    })
  }

  /**
   * Combines active workspaces apps + any apps in dev mode
   */
  get activeApps(): AppMeta[] {
    const wsAppsMeta = this.appsManager.appMeta
    return [
      // workspace apps
      ...Object.keys(wsAppsMeta).map(k => wsAppsMeta[k]),
      // one-off developing apps
      ...this.developingApps,
    ]
  }

  /**
   * The main logic of WorkspaceManager,
   * watches options and apps and updates the webpack/graph.
   */
  update = react(
    () => [this.activeApps, this.options],
    async ([activeApps]) => {
      const identifiers = Object.keys(activeApps)
      const space = await getActiveSpace()
      const apps = await getRepository(AppEntity).find({ where: { spaceId: space.id } })
      this.graphServer.setupGraph(apps)
      const packageIds = identifiers.map(this.appsManager.getIdentifierToPackageId)
      this.middlewares = await this.buildWorkspace()
      Desktop.setState({
        workspaceState: {
          appMeta: activeApps,
          packageIds,
          identifiers,
        },
      })
    },
  )

  async buildWorkspace() {
    return await watchBuildApps(this.options, this.activeApps, this.appMiddleware)
  }

  get directory() {
    if (!this.options) return ''
    return this.options.workspaceRoot
  }

  async setWorkspace(opts: CommandWsOptions) {
    log.info(`setWorkspace ${JSON.stringify(opts)}`)
    if (!this.startOpts.singleUseMode) {
      await this.graphServer.start()
    }
    this.options = opts
    this.started = true
  }

  middleware: Handler = async (req, res, next) => {
    const sendIndex = () => {
      if (!this.activeApps.length) {
        res.send({ fourohfour: 'ok' })
      } else {
        res.sendFile(join(this.directory, 'dist', 'index.html'))
      }
    }
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
      resolveAppInstallCommand,
      resolveAppBuildCommand,
      resolveAppGenTypesCommand,
      resolveCommand(AppDevOpenCommand, async ({ projectRoot }) => {
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
          appId,
          ...(await getAppMeta(projectRoot)),
        })
        return {
          type: 'success',
          message: 'Got app id',
          value: `${appId}`,
        } as const
      }),
      resolveCommand(AppDevCloseCommand, async ({ appId }) => {
        log.info('Removing build process', appId)
        this.developingApps = remove(this.developingApps, x => x.appId === appId)
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

// made this pure enforce good practice,
// you should pass in all arguments reactively
async function watchBuildApps(
  options: CommandWsOptions,
  activeApps: AppMeta[],
  appMiddleware: AppMiddleware,
): Promise<Handler[]> {
  log.info(`Start building workspace...`, options.build, activeApps)
  try {
    const res = await getAppsConfig(activeApps, options)
    if (!res) {
      log.error('No config')
      return
    }
    const { webpackConfigs, nameToAppMeta } = res
    if (options.build) {
      const configs = Object.keys(webpackConfigs).map(key => webpackConfigs[key])
      log.info(`Building ${Object.keys(webpackConfigs).join(', ')}...`)
      const [base, ...rest] = configs
      // build base dll first to ensure it feeds into rest
      await webpackPromise([base], {
        loud: true,
      })
      await webpackPromise(rest, {
        loud: true,
      })
      log.info(`Build complete`)
    } else {
      return appMiddleware.update(webpackConfigs, nameToAppMeta).map(x => x.middleware)
    }
  } catch (err) {
    log.error(`Error running workspace: ${err.message}\n${err.stack}`)
  }
}
