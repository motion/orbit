import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppOpenWorkspaceCommand, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { OrbitAppsManager } from '../managers/OrbitAppsManager'
import { findOrCreateWorkspace } from './AppCreateWorkspaceResolver'

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
    const space = await findOrCreateWorkspace({
      identifier,
      directory: path,
    })
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
