import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { CommandWsOptions, SpaceEntity, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { findOrCreateWorkspace } from './findOrCreateWorkspace'

const log = new Logger('AppOpenWorkspaceResolver')

type WorkspaceInfo = {
  identifier: string
}

/**
 * This sets the current active workspace.
 */
export async function commandWs(options: CommandWsOptions, appsManager: AppsManager) {
  const { workspaceRoot } = options
  log.info(`Got command ${workspaceRoot}`)

  Desktop.setState({
    workspaceState: {
      workspaceRoot,
    },
  })

  const { identifier } = await loadWorkspace(workspaceRoot)

  // ensure/find space
  let space = await findOrCreateWorkspace({
    identifier,
    directory: workspaceRoot,
  })

  // verify matching identifier
  if (space.identifier !== identifier) {
    // we should prompt to make sure they either are in wrong directory / or to change it
    console.error(`Wrong space, not matching this identifier`)
    process.exit(1)
  }

  // validate/update directory
  if (workspaceRoot !== space.directory) {
    console.log('You moved this space, updating to new directory', workspaceRoot)
    await getRepository(SpaceEntity).save({
      ...space,
      directory: workspaceRoot,
    })
    space = await getRepository(SpaceEntity).findOne({ identifier })
  }

  log.info('got space', space)

  // set user active space
  const user = await getRepository(UserEntity).findOne({})
  user.activeSpace = space.id
  await getRepository(UserEntity).save(user)

  // make sure we've finished updating new app info before running
  await appsManager.updateAppDefinitions(space)

  return true
}

async function loadWorkspace(path: string): Promise<WorkspaceInfo> {
  const pkg = await readJSON(join(path, 'package.json'))
  return {
    identifier: pkg.name,
  }
}
