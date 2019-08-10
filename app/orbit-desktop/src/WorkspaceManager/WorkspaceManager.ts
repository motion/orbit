import { AppsManager, getAppMeta, requireAppDefinition } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, resolveObserveMany, resolveObserveOne } from '@o/mediator'
import { AppCreateWorkspaceCommand, AppDevCloseCommand, AppDevOpenCommand, AppEntity, AppMeta, AppMetaCommand, AppWorkspaceCommand, BuildStatusModel, CallAppBitApiMethodCommand, CommandWsOptions, Space, WorkspaceInfo, WorkspaceInfoModel } from '@o/models'
import { Desktop } from '@o/stores'
import { decorate, ensure, react } from '@o/use-store'
import { remove } from 'fs-extra'
import _, { uniqBy } from 'lodash'
import { join, relative } from 'path'
import { getRepository } from 'typeorm'
import Observable from 'zen-observable'

import { GraphServer } from '../GraphServer'
import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'
import { getActiveSpace } from '../helpers/getActiveSpace'
import { AppBuilder } from './AppBuilder'
import { buildAppInfo, resolveAppBuildCommand } from './commandBuild'
import { resolveAppGenTypesCommand } from './commandGenTypes'
import { resolveAppInstallCommand } from './commandInstall'
import { getAppsConfig } from './getAppsConfig'
import { loadWorkspace } from './loadWorkspace'
import { webpackPromise } from './webpackPromise'

const log = new Logger('WorkspaceManager')

export type AppBuildModeDict = { [name: string]: 'development' | 'production' }

@decorate
export class WorkspaceManager {
  started = false
  // the apps we've toggled into development mode
  developingApps: AppMeta[] = []
  buildNameToAppMeta: { [name: string]: AppMeta } = {}
  workspaceVersion = 0
  options: CommandWsOptions = {
    action: 'run',
    dev: false,
    workspaceRoot: '',
  }
  // use this to toggle between modes for the various apps
  buildMode: AppBuildModeDict = {}
  // to send updates to children (AppBuilder)
  buildModePush = null
  buildModeObservable = new Observable<AppBuildModeDict>(observer => {
    this.buildModePush = x => observer.next(x)
  })

  // handles watching disk for apps and updating AppMeta
  appsManager = new AppsManager()
  // takes a list of apps in and starts webpack, provides web middleware
  appBuilder = new AppBuilder(this.appsManager, this.buildModeObservable)
  // shorthand to middleware
  middleware = this.appBuilder.middleware
  // starts the graphql server, can update based on app definitinos
  graphServer = new GraphServer()

  appIdToPackageJson: { [key: number]: string } = {}

  constructor(
    private mediatorServer: MediatorServer,
    private startOpts: { singleUseMode: boolean },
  ) {
    this.mediatorServer // to prevent unused
  }

  async start() {
    this.updateBuildMode()
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
    async ([started], { sleep }) => {
      ensure('started', started)
      ensure('directory', !!this.options.workspaceRoot)
      ensure('not in single build mode', this.options.action !== 'build')
      await sleep(100)
      log.info(`updating workspace build`)
      const space = await getActiveSpace()
      const apps = await getRepository(AppEntity).find({ where: { spaceId: space.id } })
      this.graphServer.setupGraph(apps)
      // this is the main build action, no need to await here
      this.updateAppBuilder()
      this.updateDesktopState()
    },
  )

  updateDesktopState() {
    Desktop.setState({
      workspaceState: {
        appMeta: this.activeApps,
        nameRegistry: Object.keys(this.buildNameToAppMeta).map(buildName => {
          const appMeta = this.buildNameToAppMeta[buildName]
          const { packageId } = appMeta
          const identifier = this.appsManager.packageIdToIdentifier(appMeta.packageId)
          const entryPath = join(appMeta.directory, appMeta.packageJson.main)
          const entryPathRelative = relative(this.options.workspaceRoot, entryPath)
          return { buildName, packageId, identifier, entryPath, entryPathRelative }
        }),
      },
    })
  }

  private updateBuildMode() {
    // update buildMode first
    this.buildMode.main = this.options.dev ? 'development' : 'production'
    for (const app of this.activeApps) {
      // apps always default to production mode
      this.buildMode[app.packageId] = this.buildMode[app.packageId] || 'production'
    }
    this.buildModePush(this.buildMode)
  }

  /**
   * Handles all webpack related things, taking the app configurations, generating
   * a webpack configuration, and updating AppsMiddlware
   */
  lastBuildConfig = ''
  async updateAppBuilder() {
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
      this.updateBuildMode()
      const res = await getAppsConfig(activeApps, this.buildMode, options)
      if (!res) {
        log.error('No config')
        return
      }
      const { webpackConfigs, buildNameToAppMeta } = res
      this.buildNameToAppMeta = buildNameToAppMeta
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
        this.appBuilder.update(webpackConfigs, buildNameToAppMeta)
      }
    } catch (err) {
      log.error(`Error running workspace: ${err.message}\n${err.stack}`)
    }
  }

  /**
   * Returns Observable for the current workspace information
   */
  observables = new Set<{ update: (next: any) => void; observable: Observable<WorkspaceInfo> }>()
  observeWorkspaceInfo() {
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

  private setBuildMode(appMeta: AppMeta, mode: 'development' | 'production') {
    log.verbose(`setBuildMode ${appMeta.packageId} ${mode}`)
    // TODO this is here because we'll have "external" app you can build
    // so we'll need to track otuside of this.buildMode
    if (mode === 'development') {
      this.developingApps.push(appMeta)
    } else {
      this.developingApps = _.remove(this.developingApps, x => x.packageId === appMeta.packageId)
    }
    this.updateDevelopingAppIdentifiers()
    this.buildMode = {
      ...this.buildMode,
      [appMeta.packageId]: mode,
    }
    this.buildModePush(this.buildMode)
  }

  private updateDevelopingAppIdentifiers() {
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
  }

  async createWorkspace(space: Partial<Space>) {
    await findOrCreateWorkspace(space)
    return true
  }

  /**
   * For external commands, this lets the CLI call various commands in here,
   * as well as the client apps if need be.
   */

  // TODO move all these into functions inside here
  // and move the resolvers up to root so we have them all in one place
  // i *think* this is more clear rather than having resolvers all over
  getResolvers() {
    return [
      resolveObserveMany(BuildStatusModel, () => {
        return this.appBuilder.observeBuildStatus()
      }),

      resolveObserveOne(WorkspaceInfoModel, () => {
        return this.observeWorkspaceInfo()
      }),

      resolveCommand(AppCreateWorkspaceCommand, this.createWorkspace),
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
        await this.updateAppBuilder()
        return true
      }),

      resolveAppInstallCommand,
      resolveAppBuildCommand,
      resolveAppGenTypesCommand,

      /**
       * Handle developing a new app independently or from within workspace
       */
      resolveCommand(AppDevOpenCommand, async options => {
        log.info(`Start developing app`, options)

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

        // ⚠️ finish refactor
        if (options.type === 'independent') {
          console.warn('TODO')
          // this.appIdToPackageJson[windowId] = appMeta.directory
        }

        this.setBuildMode(appMeta, 'development')

        return {
          type: 'success',
          message: `Developing app ${appMeta.packageId}`,
          value: {
            appId,
            identifier,
          },
        } as const
      }),

      resolveCommand(AppDevCloseCommand, async ({ identifier }) => {
        log.info(`Stopping development ${identifier}`)
        const packageId = this.appsManager.identifierToPackageId(identifier)
        if (!packageId) {
          return {
            type: 'error',
            message: `No packageId found for identifier ${identifier}`,
          }
        }
        const appMeta = this.developingApps.find(x => x.packageId === packageId)
        if (!appMeta) {
          return {
            type: 'error',
            message: `No developing app found for packageId ${packageId}`,
          }
        }
        this.setBuildMode(appMeta, 'production')
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
        const definition = this.appsManager.nodeAppDefinitions.find(x => x.id === appIdentifier)
        if (!definition) {
          log.error('No definition found')
          return null
        }
        if (!definition) {
          log.error('No definition.api found')
          return null
        }
        const api = definition.api(app)
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
