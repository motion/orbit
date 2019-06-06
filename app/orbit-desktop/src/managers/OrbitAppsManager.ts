import { Logger } from '@o/logger'
import {
  AppBit,
  AppDefinition,
  AppEntity,
  AppMeta,
  Space,
  SpaceEntity,
  User,
  UserEntity,
} from '@o/models'
import { decorate, ensure, react } from '@o/use-store'
import { watch } from 'chokidar'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { getWorkspaceNodeApis } from '../helpers/getWorkspaceNodeApis'
import { getWorkspaceAppMeta } from '../helpers/getWorkspaceAppMeta'
import { updateWorkspacePackageIds, getIdentifierFromPackageId } from '@o/cli'

const log = new Logger('OrbitAppsManager')

export const appSelectAllButDataAndTimestamps: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
  'spaceId',
  'name',
  'tabDisplay',
  'colors',
  'token',
]

@decorate
export class OrbitAppsManager {
  subscriptions = new Set<ZenObservable.Subscription>()
  spaces: Space[] = []
  apps: AppBit[] = []
  user: User = null
  spaceFolders: { [id: number]: string } = {}
  packageJsonUpdate = 0
  appMeta: { [identifier: string]: AppMeta } = {}
  nodeAppDefinitions: { [identifier: string]: AppDefinition } = {}

  async start() {
    const appsSubscription = getRepository(AppEntity)
      .observe({ select: appSelectAllButDataAndTimestamps })
      .subscribe(next => {
        this.apps = next as any
      })

    const spacesSubscription = getRepository(SpaceEntity)
      .observe({})
      .subscribe(next => {
        this.spaces = next
      })

    const userSubscription = getRepository(UserEntity)
      .observeOne({})
      .subscribe(next => {
        this.user = next
      })

    this.subscriptions.add(userSubscription)
    this.subscriptions.add(appsSubscription)
    this.subscriptions.add(spacesSubscription)
  }

  get activeSpace() {
    if (!this.user) {
      return null
    }
    return this.spaces.find(x => x.id === this.user.activeSpace)
  }

  updateAppDefinitionsReaction = react(
    () => [this.activeSpace, this.packageJsonUpdate],
    ([space]) => {
      ensure('space', !!space)
      this.updateAppDefinitions(space)
      // have cli update its cache of packageId => identifier for use installing
      updateWorkspacePackageIds(space.directory)
    },
  )

  updateAppDefinitions = async (space: Space) => {
    const definitions = await getWorkspaceNodeApis(space)
    log.info(`Got definitions for ${Object.keys(definitions)}`)
    this.nodeAppDefinitions = {
      ...this.nodeAppDefinitions,
      ...definitions,
    }
  }

  updateAppMeta = react(
    () => this.nodeAppDefinitions,
    async appDefs => {
      ensure('appDefs', !!appDefs)
      const appsMeta = await getWorkspaceAppMeta(this.activeSpace)
      ensure('appsMeta', !!appsMeta)
      for (const meta of appsMeta) {
        const identifier = getIdentifierFromPackageId(meta.packageId)
        this.appMeta[identifier] = meta
      }
    },
  )

  syncFromActiveSpacePackageJSON = react(
    () => this.activeSpace,
    (space, { useEffect }) => {
      ensure('space', !!space)
      const pkg = join(space.directory, 'package.json')
      console.log('watching package.json for changes', pkg)
      useEffect(() => {
        let watcher = watch(pkg, {
          persistent: true,
        })
        watcher.on('change', () => {
          console.log('got package.json change')
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
