import { Logger } from '@o/logger'
import { AppBit, AppDefinition, AppEntity, AppMeta, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { decorate, ensure, react, shallow } from '@o/use-store'
import { watch } from 'chokidar'
import { isEqual } from 'lodash'
import { autorun } from 'mobx'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { downloadAppDefinition } from './downloadAppDefinition'
import { findPackage } from './findPackage'
import { getIdentifierFromPackageId, identifierToPackageId } from './getPackageId'
import { getRegistryLatestVersion } from './getRegistryLatestVersion'
import { getWorkspaceApps } from './getWorkspaceApps'
import { isInstalled } from './isInstalled'
import { loadAppEntry } from './loadAppEntry'
import { requireAppDefinition } from './requireAppDefinition'
import { requireWorkspaceDefinitions } from './requireWorkspaceDefinitions'
import { updateWorkspacePackageIds } from './updateWorkspacePackageIds'

const log = new Logger('AppsManager')

type PartialSpace = Pick<Space, 'id' | 'directory'>
export type AppMetaDict = { [identifier: string]: AppMeta }
export type AppMetaDictCb = (appMeta: AppMetaDict) => void

export * from './getPackageId'
export * from './getRegistryLatestVersion'
export * from './isInstalled'
export * from './downloadAppDefinition'
export * from './requireWorkspaceDefinitions'
export * from './requireAppDefinition'
export * from './getAppInfo'
export * from './updateWorkspacePackageIds'
export * from './getWorkspaceApps'

/**
 * The AppsManager is shared between backend processes. Because we have a Workers process,
 * both it and the main Desktop process use this to observe and load the latest app definitions.
 */

@decorate
export class AppsManager {
  subscriptions = new Set<ZenObservable.Subscription>()
  nodeAppDefinitions: AppDefinition[] = []

  private started = false
  spaces: PartialSpace[] = []
  user: User | null = null
  appMeta: AppMetaDict = shallow({})
  apps: AppBit[] = []
  identifierToPackageId = identifierToPackageId

  // globalize on here this helps for REPL usage
  getIdentifierFromPackageId = getIdentifierFromPackageId
  requireWorkspaceDefinitions = requireWorkspaceDefinitions
  getWorkspaceApps = getWorkspaceApps
  updateWorkspacePackageIds = updateWorkspacePackageIds
  loadAppEntry = loadAppEntry
  requireAppDefinition = requireAppDefinition
  findPackage = findPackage
  downloadAppDefinition = downloadAppDefinition
  isInstalled = isInstalled
  getRegistryLatestVersion = getRegistryLatestVersion

  private packageJsonUpdate = 0
  private localAppsUpdate = 0
  private updatePackagesVersion = 0
  private fetchedAppsMeta = false
  private resolvedApps = false

  async start(opts: { singleUseMode?: boolean } = {}) {
    if (this.started) return
    log.verbose('Starting...')
    this.spaces = await getRepository(SpaceEntity).find()
    this.user = await getRepository(UserEntity).findOne()
    await this.updateAppMeta()
    if (opts.singleUseMode === false) {
      this.observeModels()
      this.started = true
    }
    // wait for apps/appsMeta to come down
    await new Promise<void>(res => {
      const temp = { dispose: () => {} }
      temp.dispose = autorun(() => {
        if (this.resolvedApps && this.fetchedAppsMeta) {
          res()
          temp.dispose()
        }
      })
    })
  }

  // for easier debugging
  packageIdToIdentifier(packageId: string) {
    for (const identifier of Object.keys(this.appMeta)) {
      const meta = this.appMeta[identifier]
      if (meta.packageId === packageId) {
        return identifier
      }
    }
    throw new Error(`No identifer for packageId ${packageId}`)
  }

  activeSpace = react(
    () => [this.user, this.spaces],
    () => this.user && this.spaces.find(x => x.id === this.user.activeSpace),
  )

  activeSpaceDirectory = react(
    () => this.activeSpace,
    x => x?.directory || '',
  )

  activeSpaceId = react(
    () => this.activeSpace,
    x => x?.id || -1,
  )

  private observeModels = () => {
    const spacesSubscription = getRepository(SpaceEntity)
      .observe({
        select: ['id', 'directory'],
      })
      .subscribe(_ => {
        const spaces = _ as Space[]
        const next = spaces.map(space => ({ id: space.id, directory: space.directory }))
        if (!isEqual(next, this.spaces)) {
          this.spaces = next
        }
      })
    const userSubscription = getRepository(UserEntity)
      .observeOne({})
      .subscribe(next => {
        this.user = next as User
      })
    this.subscriptions.add(userSubscription)
    this.subscriptions.add(spacesSubscription)
  }

  appsUpdate = react(
    () => this.activeSpaceId,
    (id, { useEffect }) => {
      ensure('id', id !== -1)
      useEffect(() => {
        const subsription = getRepository(AppEntity)
          .observe({
            where: {
              spaceId: this.activeSpaceId,
            },
          })
          .subscribe(next => {
            log.verbose(`Update apps`)
            this.apps = next as AppBit[]
            this.resolvedApps = true
          })
        return () => {
          log.verbose(`Unsubscribe from space subscription`)
          subsription.unsubscribe()
        }
      })
    },
  )

  onUpdatedCb = new Set<AppMetaDictCb>()
  onUpdatedAppMeta = (cb: AppMetaDictCb) => {
    this.onUpdatedCb.add(cb)
  }

  updateAppMetaWatcher = react(
    () => [this.activeSpaceDirectory, this.packageJsonUpdate, this.localAppsUpdate],
    async (_, { sleep, when }) => {
      ensure('this.started', this.started)
      ensure('activeSpaceDirectory', !!this.activeSpaceDirectory)
      await sleep(200) // debounce
      await when(() => this.updatePackagesVersion !== 0)
      await this.updateAppMeta()
    },
  )

  updatePackageJsonVersionWatcher = react(
    () => [this.activeSpaceDirectory, this.started],
    async (_, { useEffect }) => {
      ensure('directory', !!this.activeSpaceDirectory)
      ensure('this.started', this.started)
      const pkg = join(this.activeSpaceDirectory, 'package.json')
      log.info('watching package.json for changes', pkg)
      useEffect(() => {
        let watcher = watch(pkg, {
          persistent: true,
          awaitWriteFinish: true,
        })
        watcher.on('change', () => {
          log.info('got package.json change')
          this.packageJsonUpdate = Math.random()
        })
        return () => {
          watcher.close()
        }
      })
    },
  )

  updateLocalAppsWatcher = react(
    () => [this.activeSpaceDirectory, this.started],
    async (_, { useEffect }) => {
      ensure('directory', !!this.activeSpaceDirectory)
      ensure('this.started', this.started)
      const appsDir = join(this.activeSpaceDirectory, 'apps')
      log.info('watching local apps for changes', appsDir)
      useEffect(() => {
        let watcher = watch([appsDir], {
          persistent: true,
          awaitWriteFinish: true,
          ignoreInitial: true,
          // just watch the base directory for new folders
          depth: 0,
        })
        watcher
          .on('add', () => {
            log.info('added an app dir')
            this.localAppsUpdate = Math.random()
          })
          .on('unlink', () => {
            log.info('removed an app dir')
            this.localAppsUpdate = Math.random()
          })
        return () => {
          watcher.close()
        }
      })
    },
  )

  updateAppMeta = async () => {
    if (!this.activeSpace) {
      log.warning(`warn! called update with no activespace`)
      return
    }
    await Promise.all([
      this.updateNodeDefinitions(),
      // have cli update its cache of packageId => identifier for use installing
      updateWorkspacePackageIds(this.activeSpace.directory || ''),
    ])
    const appsMeta = await getWorkspaceApps(this.activeSpace.directory || '')
    if (!appsMeta) {
      log.warning(`warn! no appsMeta`)
      return
    }
    log.verbose(`got apps ${appsMeta.map(x => x.packageId).join(',')}`)
    let updated = false
    for (const appMeta of appsMeta) {
      const identifier = getIdentifierFromPackageId(appMeta.packageId)
      log.debug(`setting apps meta ${appMeta.packageId} => ${identifier}`)
      if (identifier !== null) {
        this.appMeta[identifier] = appMeta
        updated = true
      } else {
        log.warning(`no identifier found for ${appMeta.packageId}`)
      }
    }

    if (updated) {
      for (const cb of [...this.onUpdatedCb]) {
        cb(this.appMeta)
      }
    }

    // dont finish starting appsManager until we've run this once
    this.fetchedAppsMeta = true
  }

  private updateNodeDefinitions = async (space: Space = this.activeSpace) => {
    const definitions = await requireWorkspaceDefinitions((space && space.directory) || '', 'node')
    log.verbose(
      `Got definitions:\n${definitions.map(x => `${x.type}: ${x.message}`).join(',\n')}`,
      definitions,
    )
    this.nodeAppDefinitions = definitions.map(x => x.type === 'success' && x.value).filter(Boolean)
  }

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }
}
