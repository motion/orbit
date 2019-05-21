import { decorate, ensure, react } from '@o/kit'
import { AppBit, AppEntity, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { FSWatcher, watch } from 'chokidar'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { readWorkspaceAppDefs } from '../helpers/readWorkspaceAppDefs'

export const appSelectAllButDataAndTimestamps: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
  'sourceIdentifier',
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
  packageWatcher: FSWatcher = null
  packageRefresh = 0

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

  activeAppDefinitions = react(
    () => [this.activeSpace, this.packageRefresh],
    async ([space]) => {
      ensure('space', !!space)
      const appDefinitions = await readWorkspaceAppDefs(space)
      console.log('got app definitions', appDefinitions)
      return appDefinitions
    },
  )

  syncFromActiveSpacePackageJSON = react(
    () => this.activeSpace,
    space => {
      ensure('space', !!space)
      if (this.packageWatcher) {
        this.packageWatcher.close()
      }
      const pkg = join(space.directory, 'package.json')
      this.packageWatcher = watch(pkg, {
        persistent: true,
      })
      this.packageWatcher.on('change', () => {
        this.packageRefresh++
      })
    },
  )

  // ensureAppBits = react(() => this.activeAppDefinitions, definitions => {})

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

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }
}
