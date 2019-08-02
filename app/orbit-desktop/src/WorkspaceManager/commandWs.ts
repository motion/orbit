import { Logger } from '@o/logger'
import { CommandWsOptions, Space, SpaceEntity, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'
import { WorkspaceManager } from './WorkspaceManager'

const log = new Logger('commandWs')

/**
 * This sets the current active workspace.
 */
export async function commandWs(options: CommandWsOptions, workspaceManager: WorkspaceManager) {
  const { workspaceRoot } = options
  log.info(`${workspaceRoot}`)

  Desktop.setState({
    workspaceState: {
      workspaceRoot,
    },
  })

  await loadWorkspace(workspaceRoot)

  // update workspace
  await workspaceManager.setWorkspace(options)

  return true
}

export async function loadWorkspace(directory: string): Promise<Space> {
  const identifier = (await readJSON(join(directory, 'package.json'))).name

  // ensure/find space
  let space = await findOrCreateWorkspace({
    identifier: identifier,
    directory: directory,
  })

  // verify matching identifier
  if (space.identifier !== identifier) {
    // we should prompt to make sure they either are in wrong directory / or to change it
    console.error(`Wrong space, not matching this identifier ${space.identifier} vs ${identifier}`)
    process.exit(1)
  }

  // validate/update directory
  if (directory !== space.directory) {
    log.info(`You moved this space, updating to new directory: ${directory}`)
    await getRepository(SpaceEntity).save({
      ...space,
      directory: directory,
    })
    space = await getRepository(SpaceEntity).findOne({ identifier: identifier })
  }

  // set user active space
  const user = await getRepository(UserEntity).findOne({})
  user.activeSpace = space.id
  await getRepository(UserEntity).save(user)

  return space
}
