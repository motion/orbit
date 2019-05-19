import { Logger, resolveCommand, Subscription } from '@o/kit'
import { AppEntity, AppOpenWorkspaceCommand, SpaceEntity, UserEntity } from '@o/models'
import { randomAdjective, randomNoun } from '@o/ui'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'
import Watchpack from 'watchpack'

import { appSelectAllButDataAndTimestamps } from '../managers/OrbitAppsManager'

const log = new Logger('AppOpenWorkspaceResolver')

type WorkspaceInfo = {
  identifier: string
}

export const AppOpenWorkspaceResolver = resolveCommand(
  AppOpenWorkspaceCommand,
  async ({ path }) => {
    console.log('should load workspace', path)
    const { identifier } = await loadWorkspace(path)
    console.log('got', identifier)

    // ensure/find space
    const space = await findOrCreateSpace(identifier, path)
    console.log('got space', space)

    // set active space
    const user = await getRepository(UserEntity).findOne({})
    user.activeSpace = space.id
    await getRepository(UserEntity).save(user)

    // we need two way syncing:
    // if they update package.json, we update AppBit
    // if they update AppBit, we update package.json
    syncAppBitToPackageJson(space.id)
    syncPackageJsonToAppBit(path, space.id)

    return true
  },
)

let appsSubscription: Subscription = null
async function syncAppBitToPackageJson(spaceId: number) {
  if (appsSubscription) {
    appsSubscription.unsubscribe()
  }

  appsSubscription = getRepository(AppEntity)
    .observe({
      select: appSelectAllButDataAndTimestamps,
      where: {
        spaceId,
      },
    })
    .subscribe(apps => {
      console.log('space got apps, sync down', apps)
    })
}

let watcher: Watchpack = null
async function syncPackageJsonToAppBit(directory: string, spaceId: number) {
  if (watcher) {
    watcher.close()
  }
  const files = join(directory, 'package.json')
  console.log('watching files', files)
  watcher = new Watchpack(files, [])
  watcher.on('change', filePath => {
    console.log('file changed, check for updates', filePath, spaceId)
  })
}

async function loadWorkspace(path: string): Promise<WorkspaceInfo> {
  const pkg = await readJSON(join(path, 'package.json'))
  return {
    identifier: pkg.name,
  }
}

async function findOrCreateSpace(identifier: string, directory: string) {
  const ws = await getRepository(SpaceEntity).findOne({
    where: {
      identifier,
    },
  })

  log.info('Find or create space', identifier, 'found?', !!ws)

  if (ws) {
    // moved!
    if (ws.directory !== directory) {
      console.log('directory seems to have moved, we should prompt and allow choice')
    }

    return ws
  }

  return await getRepository(SpaceEntity).create({
    identifier,
    name: `${randomAdjective()} ${randomNoun()}`,
    colors: ['orange', 'pink'],
    paneSort: [],
    directory,
  })
}
