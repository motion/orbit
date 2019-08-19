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
import { loadAppEntry } from './loadAppEntry'
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

  // globalize on here this helps for REPL usage
  identifierToPackageId = getIdentifierToPackageId
  getIdentifierFromPackageId = getIdentifierFromPackageId
  requireWorkspaceDefinitions = requireWorkspaceDefinitions
  getWorkspaceApps = getWorkspaceApps
  updateWorkspacePackageIds = updateWorkspacePackageIds
  loadAppEntry = loadAppEntry

  private packageJsonUpdate = 0
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
    await new Promise(res => {
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
    throw new Error(`No packageId found for identifer`)
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

    const appsMeta = await getWorkspaceApps(this.activeSpace.directory || '')
    if (!appsMeta) return
    log.verbose(`got apps ${appsMeta.map(x => x.packageId).join(',')}`)
    let updated = false
    for (const appMeta of appsMeta) {
      const identifier = getIdentifierFromPackageId(appMeta.packageId)
      log.verbose(`setting apps meta ${appMeta.packageId} => ${identifier}`)
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

  private updateNodeDefinitions = async (space: Space) => {
    const definitions = await requireWorkspaceDefinitions((space && space.directory) || '', 'node')
    log.verbose(
      `Got definitions ${definitions.map(x => `${x.type}: ${x.message}`).join(',\n')}`,
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
