import { Logger } from '@o/logger'
import { AppBit, AppDefinition, AppEntity, AppMeta, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { decorate, ensure, react, shallow } from '@o/use-store'
import { watch } from 'chokidar'
import { isEqual } from 'lodash'
import { autorun } from 'mobx'
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

  private started = false
  spaces: PartialSpace[] = []
  user: User | null = null
  appMeta: AppMetaDict = shallow({})
  apps: AppBit[] = []

  private packageJsonUpdate = 0
  private updatePackagesVersion = 0
  private fetchedAppsMeta = false
  private resolvedApps = false

  // for easier debugging
  getIdentifierToPackageId = getIdentifierToPackageId

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
    await new Promise(res => {
      const dispose = autorun(() => {
        if (this.resolvedApps && this.fetchedAppsMeta) {
          dispose()
          res()
        }
      })
    })
  }

  get activeSpace() {
    const user = this.user
    if (!user) {
      return null
    }
    return this.spaces.find(x => x.id === user.activeSpace)
  }

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
            this.resolvedApps = true
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

  updateAppMetaWatcher = react(
    () => [this.activeSpace, this.nodeAppDefinitions, this.packageJsonUpdate],
    async ([activeSpace, appDefs], { when }) => {
      ensure('this.started', this.started)
      await when(() => this.updatePackagesVersion !== 0)
      ensure('info', !!activeSpace && !!appDefs)
      await this.updateAppMeta()
    },
  )

  updatePackageJsonVersionWatcher = react(
    () => this.activeSpace && this.activeSpace.directory,
    async (directory, { useEffect }) => {
      ensure('directory', !!directory)
      ensure('this.started', this.started)
      const pkg = join(directory || '', 'package.json')
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

  updateAppMeta = async () => {
    if (!this.activeSpace) return
    await Promise.all([
      this.updateNodeDefinitions(this.activeSpace),
      // have cli update its cache of packageId => identifier for use installing
      updateWorkspacePackageIds(this.activeSpace.directory || ''),
    ])
    const apps = await getWorkspaceApps(this.activeSpace.directory || '')
    if (!apps) return
    log.verbose(`got apps ${apps.map(x => x.packageId).join(',')}`)

    let updated = false
    for (const appInfo of apps) {
      const identifier = getIdentifierFromPackageId(appInfo.packageId)
      log.verbose(`setting apps meta ${appInfo.packageId} => ${identifier}`)
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

    // dont finish starting appsManager until we've run this once
    this.fetchedAppsMeta = true
  }

  private updateNodeDefinitions = async (space: Space) => {
    const definitions = await requireWorkspaceDefinitions((space && space.directory) || '', 'node')
    log.verbose(`Got definitions ${definitions.map(x => x.type)}`, definitions)
    this.nodeAppDefinitions = definitions.map(x => x.type === 'success' && x.value).filter(Boolean)
  }

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }
}
