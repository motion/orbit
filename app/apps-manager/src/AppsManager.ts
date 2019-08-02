import { Logger } from '@o/logger'
import { AppBit, AppDefinition, AppEntity, AppMeta, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { decorate, ensure, react } from '@o/use-store'
import { watch } from 'chokidar'
import { isEqual } from 'lodash'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { getIdentifierFromPackageId, getIdentifierToPackageId } from './getPackageId'
import { getWorkspaceApps } from './getWorkspaceApps'
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
export * from './buildInfo'
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

  started = false
  spaces: PartialSpace[] = []
  user: User | null = null
  appMeta: AppMetaDict = {}
  apps: AppBit[] = []

  private packageJsonUpdate = 0
  private updatePackagesVersion = 0

  // for easier debugging
  getIdentifierToPackageId = getIdentifierToPackageId

  async start() {
    if (this.started) {
      return
    }
    log.info('Starting...')
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
    this.started = true
  }

  get activeSpace() {
    const user = this.user
    if (!user) {
      return null
    }
    return this.spaces.find(x => x.id === user.activeSpace)
  }

  appsUpdate = react(
    () => this.activeSpace,
    (_, { useEffect }) => {
      ensure('this.activeSpace', !!this.activeSpace)
      useEffect(() => {
        const subsription = getRepository(AppEntity)
          .observe({
            where: {
              spaceId: this.activeSpace.id,
            },
          })
          .subscribe(next => {
            this.apps = next as AppBit[]
          })
        return () => {
          subsription.unsubscribe()
        }
      })
    },
  )

  onUpdatedCb = new Set<AppMetaDictCb>()
  onUpdatedAppMeta = (cb: AppMetaDictCb) => {
    this.onUpdatedCb.add(cb)
  }

  updateAppDefinitionsReaction = react(
    () => [this.activeSpace, this.packageJsonUpdate],
    async ([space], { when }) => {
      await when(() => this.started)
      ensure('space', !!space)
      if (space) {
        this.updateAppDefinitions(space)
        // have cli update its cache of packageId => identifier for use installing
        await updateWorkspacePackageIds(space.directory || '')
        this.updatePackagesVersion = Math.random()
      }
    },
  )

  updateAppDefinitions = async (space: Space) => {
    const definitions = await requireWorkspaceDefinitions((space && space.directory) || '', 'node')
    log.verbose(`Got definitions ${definitions.map(x => x.type)}`, definitions)
    this.nodeAppDefinitions = definitions.map(x => x.type === 'success' && x.value).filter(Boolean)
  }

  updateAppMeta = react(
    () => [this.activeSpace, this.nodeAppDefinitions, this.updatePackagesVersion],
    async ([activeSpace, appDefs], { when }) => {
      await when(() => this.started)
      ensure('appDefs', !!appDefs)
      if (!activeSpace) return
      const apps = await getWorkspaceApps(activeSpace.directory || '')
      ensure('apps', !!apps)

      let updated = false
      for (const appInfo of apps) {
        const identifier = getIdentifierFromPackageId(appInfo.packageId)
        log.verbose('setting apps meta', appInfo.packageId, identifier)
        if (identifier !== null) {
          this.appMeta[identifier] = appInfo
          updated = true
        } else {
          log.warning(`no identifier found for ${appInfo.packageId}`)
        }
      }

      if (updated) {
        for (const cb of [...this.onUpdatedCb]) {
          cb(this.appMeta)
        }
      }
    },
  )

  syncFromActiveSpacePackageJSON = react(
    () => this.activeSpace,
    async (space, { useEffect, when }) => {
      await when(() => this.started)
      ensure('space', !!space)
      const pkg = join(space.directory || '', 'package.json')
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

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }
}
