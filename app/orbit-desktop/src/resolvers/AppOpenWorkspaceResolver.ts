import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppOpenWorkspaceCommand, SpaceEntity, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { randomAdjective, randomNoun } from '@o/utils'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { OrbitAppsManager } from '../managers/OrbitAppsManager'

const log = new Logger('AppOpenWorkspaceResolver')

type WorkspaceInfo = {
  identifier: string
}

export function createAppOpenWorkspaceResolver(appsManager: OrbitAppsManager) {
  return resolveCommand(AppOpenWorkspaceCommand, async ({ path, appIdentifiers }) => {
    Desktop.setState({
      workspaceState: {
        path,
        appIdentifiers,
      },
    })

    const { identifier } = await loadWorkspace(path)
    log.info('got', identifier)

    // ensure/find space
    const space = await findOrCreateSpace(identifier, path)
    log.info('got space', space)

    // set active space
    const user = await getRepository(UserEntity).findOne({})
    user.activeSpace = space.id
    await getRepository(UserEntity).save(user)

    // ensure app bits
    await appsManager.updateAppDefinitions(space)

    return true
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

  return await getRepository(SpaceEntity).save({
    identifier,
    name: `${randomAdjective()} ${randomNoun()}`,
    colors: ['orange', 'pink'],
    paneSort: [],
    directory,
  })
}
