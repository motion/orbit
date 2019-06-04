import { AppDefinition, decorate, ensure, Logger, react } from '@o/kit'
import { AppBit, AppEntity, AppMeta, Space, SpaceEntity, User, UserEntity } from '@o/models'
import { watch } from 'chokidar'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { getActiveSpace } from '../helpers/getActiveSpace'
import { getWorkspaceAppDefs } from '../helpers/getWorkspaceAppDefs'
import { getWorkspaceAppMeta } from '../helpers/getWorkspaceAppMeta'

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

export async function ensureAppBitsForAppDefinitions(definitions: AppDefinition[]) {
  const space = await getActiveSpace()
  log.info(`Ensuring app bits for definitions ${definitions.length}`)
  for (const def of definitions) {
    // downloaded definition, create new AppBit for it
    if (
      !(await getRepository(AppEntity).findOne({
        where: {
          identifier: def.id,
        },
      }))
    ) {
      log.info(`No app bit found for definition ${def.id}`)
      // TODO we need this to be available as a direct call from install command
      // it also needs to be here to pick up actions from adding to package.json
      await getRepository(AppEntity).create({
        target: 'app',
        name: `${def.name}`,
        identifier: `${def.id}`,
        itemType: def.itemType,
        spaces: [space],
        spaceId: space.id,
        tabDisplay: 'plain',
        colors: ['black', 'black'],
        token: '',
        data: {},
      })
    }
  }
}

@decorate
export class OrbitAppsManager {
  subscriptions = new Set<ZenObservable.Subscription>()
  spaces: Space[] = []
  apps: AppBit[] = []
  user: User = null
  spaceFolders: { [id: number]: string } = {}
  packageJsonUpdate = 0
  appMeta: { [identifier: string]: AppMeta } = {}
  appDefinitions: { [identifier: string]: AppDefinition } = {}
  packageIdToIdentifier = {}

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
    },
  )

  updateAppDefinitions = async (space: Space) => {
    log.info(`Updaing app definitions for space ${space.id}`)
    const { definitions, packageIdToIdentifier } = await getWorkspaceAppDefs(space)
    await ensureAppBitsForAppDefinitions(Object.keys(definitions).map(x => definitions[x]))
    this.packageIdToIdentifier = {
      ...this.packageIdToIdentifier,
      ...packageIdToIdentifier,
    }
    this.appDefinitions = {
      ...this.appDefinitions,
      ...definitions,
    }
  }

  updateAppMeta = react(
    () => this.appDefinitions,
    async appDefs => {
      ensure('appDefs', !!appDefs)
      const appsMeta = await getWorkspaceAppMeta(this.activeSpace)
      ensure('appsMeta', !!appsMeta)
      for (const meta of appsMeta) {
        const identifier = this.packageIdToIdentifier[meta.packageId]
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
