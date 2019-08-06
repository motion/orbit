import { AppsManager, getAppMeta, requireAppDefinition } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, resolveObserveOne } from '@o/mediator'
import { AppCloseWindowCommand, AppCreateWorkspaceCommand, AppDevCloseCommand, AppDevOpenCommand, AppEntity, AppMeta, AppMetaCommand, AppWorkspaceCommand, CallAppBitApiMethodCommand, CommandWsOptions, WorkspaceInfo, WorkspaceInfoModel } from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { decorate, ensure, react } from '@o/use-store'
import { remove } from 'fs-extra'
import _, { uniqBy } from 'lodash'
import { join } from 'path'
import { getRepository } from 'typeorm'
import Observable from 'zen-observable'

import { GraphServer } from '../GraphServer'
import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'
import { getActiveSpace } from '../helpers/getActiveSpace'
import { appStatusManager } from '../managers/AppStatusManager'
import { AppMiddleware } from './AppMiddleware'
import { buildAppInfo, resolveAppBuildCommand } from './commandBuild'
import { resolveAppGenTypesCommand } from './commandGenTypes'
import { resolveAppInstallCommand } from './commandInstall'
import { getAppsConfig } from './getAppsConfig'
import { loadWorkspace } from './loadWorkspace'
import { webpackPromise } from './webpackPromise'

const log = new Logger('WorkspaceManager')

@decorate
export class WorkspaceManager {
  // the apps we've toggled into development mode
  developingApps: AppMeta[] = []
  started = false
  workspaceVersion = 0
  options: CommandWsOptions = {
    action: 'run',
    dev: false,
    workspaceRoot: '',
  }
  appsManager = new AppsManager()
  appMiddleware = new AppMiddleware(this.appsManager)
  graphServer = new GraphServer()
  middleware = this.appMiddleware.middleware

  // use this to toggle between modes for the various apps
  buildMode: { [name: string]: 'development' | 'production' } = {}

  appIdToPackageJson: { [key: number]: string } = {}

  constructor(
    private mediatorServer: MediatorServer,
    private startOpts: { singleUseMode: boolean },
  ) {}

  async start() {
    // Sends messages between webpack and client apps so we can display status messages
    this.appMiddleware.onStatus(status => {
      appStatusManager.sendMessage(status)
    })
  }

  async updateWorkspace(opts: CommandWsOptions) {
    log.info(`updateWorkspace ${JSON.stringify(opts)}`)
    await loadWorkspace(opts.workspaceRoot)
    await this.appsManager.start({
      singleUseMode: this.startOpts.singleUseMode,
    })
    if (!this.startOpts.singleUseMode) {
      await this.graphServer.start()
    }
    this.options = opts
    this.started = true
  }

  /**
   * Combines active workspaces apps + any apps in dev mode
   */
  get activeApps(): AppMeta[] {
    const wsAppsMeta = this.appsManager.appMeta
    return uniqBy(
      [
        // developing apps
        ...this.developingApps,
        // workspace apps
        ...Object.keys(wsAppsMeta).map(k => wsAppsMeta[k]),
      ],
      x => x.packageId,
    )
  }

  /**
   * The main logic of WorkspaceManager,
   * watches options and apps and updates the webpack/graph.
   */
  update = react(
    () => [this.started, this.activeApps, this.options, this.buildMode],
    async ([started, activeApps], { sleep }) => {
      ensure('started', started)
      ensure('directory', !!this.options.workspaceRoot)
      ensure('not in single build mode', this.options.action !== 'build')
      await sleep(100)
      log.verbose(`update`)
      const identifiers = Object.keys(activeApps)
      const space = await getActiveSpace()
      const apps = await getRepository(AppEntity).find({ where: { spaceId: space.id } })
      this.graphServer.setupGraph(apps)
      const packageIds = identifiers.map(this.appsManager.identifierToPackageId)
      // this is the main build action, no need to await here
      this.updateBuild()
      Desktop.setState({
        workspaceState: {
          workspaceRoot: this.options.workspaceRoot,
          appMeta: activeApps,
          packageIds,
          identifiers,
        },
      })
    },
  )

  /**
   * Handles all webpack related things, taking the app configurations, generating
   * a webpack configuration, and updating AppsMiddlware
   */
  lastBuildConfig = ''
  async updateBuild() {
    const { options, activeApps, buildMode } = this
    log.info(`Start building workspace, building ${activeApps.length} apps...`, options, activeApps)
    if (!activeApps.length) {
      log.error(`Must have more than one app, workspace didn't detect any.`)
      return
    }

    // avoid costly rebuilds
    const nextBuildConfig = JSON.stringify({ options, activeApps, buildMode })
    if (this.lastBuildConfig === nextBuildConfig) {
      log.verbose(`Same build config, avoiding rebuild`)
      return
    } else {
      this.lastBuildConfig = nextBuildConfig
    }

    try {
      const res = await getAppsConfig(
        activeApps.map(appMeta => ({
          ...appMeta,
          buildMode: this.buildMode[appMeta.packageId],
        })),
        options,
      )
      if (!res) {
        log.error('No config')
        return
      }
      const { webpackConfigs, nameToAppMeta } = res
      if (options.action === 'build') {
        const { base, ...rest } = webpackConfigs
        const configs = Object.keys(rest).map(key => rest[key])
        log.info(`Building ${Object.keys(webpackConfigs).join(', ')}...`)
        // build base dll first to ensure it feeds into rest
        await webpackPromise([base], {
          loud: true,
        })
        await webpackPromise(configs, {
          loud: true,
        })
        log.info(`Build complete!`)
      } else {
        this.appMiddleware.update(webpackConfigs, nameToAppMeta)
      }
    } catch (err) {
      log.error(`Error running workspace: ${err.message}\n${err.stack}`)
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
    })
    return observable
  }

  private setBuildMode(packageId: string, status: 'development' | 'production') {
    this.buildMode = {
      ...this.buildMode,
      [packageId]: status,
    }
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
      resolveCommand(AppCreateWorkspaceCommand, async props => {
        await findOrCreateWorkspace(props)
        return true
      }),
      resolveCommand(AppWorkspaceCommand, async options => {
        const { workspaceRoot } = options
        log.info(`AppOpenWorkspaceCommand ${workspaceRoot}`)
        if (options.clean) {
          log.info(`Cleaning workspace dist directory`)
          try {
            await remove(join(workspaceRoot, 'dist'))
          } catch (err) {
            log.info(`Error cleaning ${err.message}`, err)
          }
        }
        await this.updateWorkspace(options)
        await this.updateBuild()
        return true
      }),

      resolveAppInstallCommand,
      resolveAppBuildCommand,
      resolveAppGenTypesCommand,

      /**
       * Handle developing a new app independently or from within workspace
       */
      resolveCommand(AppDevOpenCommand, async options => {
        let appMeta: AppMeta
        let appId: number

        if (options.type === 'independent') {
          // launch new app
          appMeta = await getAppMeta(options.projectRoot)
          appId = -1
        } else {
          appId = options.appId
          appMeta = this.appsManager.appMeta[options.identifier]
          if (!appMeta) {
            return {
              type: 'error',
              message: `No appMeta found in active apps for identiifer ${options.identifier}`,
            } as const
          }
        }

        // ensure built so we can load appInfo
        log.info(`Building app info...`, appMeta)
        const buildRes = await buildAppInfo({
          projectRoot: appMeta.directory,
        })
        if (buildRes.type !== 'success') {
          return buildRes
        }

        // load appInfo to get identifier
        log.info(`Reading app definition...`)
        const appInfoRes = await requireAppDefinition({
          directory: appMeta.directory,
          packageId: appMeta.packageId,
          types: ['appInfo'],
        })
        if (appInfoRes.type !== 'success') {
          return appInfoRes
        }

        const identifier = appInfoRes.value.id
        log.info(`Loaded app with identifier: ${identifier}`)

        console.log('finish toggling dev mode')

        // ⚠️ finish refactor
        if (options.type === 'independent') {
          // this.appIdToPackageJson[windowId] = appMeta.directory
        }

        // always do this:
        this.developingApps.push(appMeta)
        this.setBuildMode(appMeta.packageId, 'development')

        const developingAppIdentifiers = this.developingApps.map(x =>
          this.appsManager.packageIdToIdentifier(x.packageId),
        )
        if (developingAppIdentifiers.some(x => !x)) {
          log.warning(`Missing identifier`)
        }
        Desktop.setState({
          workspaceState: {
            developingAppIdentifiers,
          },
        })

        return {
          type: 'success',
          message: 'Got app id',
          value: {
            appId,
            identifier,
          },
        } as const
      }),

      resolveCommand(AppDevCloseCommand, async ({ identifier }) => {
        log.info('Stopping development', identifier)
        const packageId = this.appsManager.identifierToPackageId(identifier)
        const appMeta = this.developingApps.find(x => x.packageId === packageId)
        this.developingApps = _.remove(this.developingApps, x => x.packageId === packageId)
        this.setBuildMode(appMeta.packageId, 'production')
        // ⚠️
        const windowId = -1
        if (Electron.state.appWindows[windowId]) {
          log.verbose('Close window', windowId)
          await this.mediatorServer.sendRemoteCommand(AppCloseWindowCommand, { windowId })
        }
        return {
          type: 'success',
          message: `Stopped development of ${identifier}`,
        }
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
