import { getIdentifierFromPackageId, getIdentifierToPackageId, getWorkspaceAppPaths, requireWorkspaceDefinitions, updateWorkspacePackageIds } from '@o/cli'
import { Logger } from '@o/logger'
import { AppBit, AppDefinition, AppEntity, AppMeta, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { decorate, ensure, react } from '@o/use-store'
import { watch } from 'chokidar'
import { join } from 'path'
import { getRepository } from 'typeorm'

const log = new Logger('OrbitAppsManager')

@decorate
export class OrbitAppsManager {
  subscriptions = new Set<ZenObservable.Subscription>()
  spaces: Space[] = []
  apps: AppBit[] = []
  user: User | null = null
  spaceFolders: { [id: number]: string } = {}
  packageJsonUpdate = 0
  appMeta: { [identifier: string]: AppMeta } = {}
  nodeAppDefinitions: { [identifier: string]: AppDefinition } = {}
  updatePackagesVersion = 0

  // for easier debugging
  getIdentifierToPackageId = getIdentifierToPackageId

  async start() {
    const appsSubscription = getRepository(AppEntity)
      .observe({})
      .subscribe(next => {
        this.apps = next as any
      })

    const spacesSubscription = getRepository(SpaceEntity)
      .observe({})
      .subscribe(next => {
        this.spaces = next as Space[]
      })

    const userSubscription = getRepository(UserEntity)
      .observeOne({})
      .subscribe(next => {
        this.user = next as User
      })

    this.subscriptions.add(userSubscription)
    this.subscriptions.add(appsSubscription)
    this.subscriptions.add(spacesSubscription)
  }

  get activeSpace() {
    const user = this.user
    if (!user) {
      return null
    }
    return this.spaces.find(x => x.id === user.activeSpace)
  }

  updateAppDefinitionsReaction = react(
    () => [this.activeSpace, this.packageJsonUpdate],
    async ([space]) => {
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
    log.info(`Got definitions for ${Object.keys(definitions)}`)
    this.nodeAppDefinitions = {
      ...this.nodeAppDefinitions,
      ...definitions.reduce((acc, def) => {
        acc[def.id] = def
        return acc
      }, {}),
    }
  }

  updateAppMeta = react(
    () => [this.nodeAppDefinitions, this.updatePackagesVersion],
    async ([appDefs]) => {
      ensure('appDefs', !!appDefs)
      const activeSpace = this.activeSpace
      if (!activeSpace) return
      const appsMeta = await getWorkspaceAppPaths(activeSpace.directory || '')
      ensure('appsMeta', !!appsMeta)
      for (const meta of appsMeta) {
        const identifier = getIdentifierFromPackageId(meta.packageId)
        log.info('setting apps meta2', meta.packageId, identifier)
        if (identifier !== null) {
          this.appMeta[identifier] = meta
        } else {
          log.error(`no identifier found for ${meta.packageId}`)
        }
      }
    },
  )

  syncFromActiveSpacePackageJSON = react(
    () => this.activeSpace,
    (space, { useEffect }) => {
      ensure('space', !!space)
      if (space) {
        const pkg = join(space.directory || '', 'package.json')
        log.info('watching package.json for changes', pkg)
        useEffect(() => {
          let watcher = watch(pkg, {
            persistent: true,
          })
          watcher.on('change', () => {
            log.info('got package.json change')
            this.packageJsonUpdate = Math.random()
          })
          return () => {
            watcher.close()
          }
        })
      }
    },
  )

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }
}

// experiment in making app icons on your desktop

// let appsSubscription: Subscription = null
// async function syncAppBitToPackageJson(spaceId: number) {
//   if (appsSubscription) {
//     appsSubscription.unsubscribe()
//   }

//   appsSubscription = getRepository(AppEntity)
//     .observe({
//       select: appSelectAllButDataAndTimestamps,
//       where: {
//         spaceId,
//       },
//     })
//     .subscribe(apps => {
//       console.log('space got apps, sync down', apps)
//     })
// }

// manageDesktopFoldersAndIcons = react(
//   () => always(this.apps, this.spaces),
//   async () => {
//     ensure('has spaces and apps', !!this.spaces.length && !!this.apps.length)
//     await this.ensureSpacesFolders(this.spaces)
//     await this.ensureSpacesAppIcons(this.apps)
//   },
// )

// async ensureSpacesFolders(spaces: Space[]) {
//   await Promise.all(
//     spaces.map(async space => {
//       const spaceFolder = join(Config.paths.desktop, space.name)
//       await ensureDir(spaceFolder)
//       const files = await readdir(spaceFolder)
//       const existingSpaceConfig = await pathExists(join(spaceFolder, 'orbit.json'))
//       const isValidOrbitDir = files.length === 0 || existingSpaceConfig
//       if (isValidOrbitDir) {
//         this.spaceFolders[space.id] = spaceFolder
//       }
//     }),
//   )
// }

// async ensureSpacesAppIcons(apps: AppBit[]) {
//   await Promise.all(
//     apps.map(async app => {
//       const dest = this.spaceFolders[app.spaceId]
//       if (!dest) return
//       // console.log('should copy app icon, need to get app definition')
//       // await copy(Config.paths.dotApp, join(dest, `${app.name}.app`))
//     }),
//   )
// }
