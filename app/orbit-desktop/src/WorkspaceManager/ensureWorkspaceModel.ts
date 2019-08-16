import { Logger } from '@o/logger'
import { Space, SpaceEntity, UserEntity } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { findOrCreateWorkspace } from '../helpers/findOrCreateWorkspace'

const log = new Logger('loadWorkspace')

export async function ensureWorkspaceModel(directory: string): Promise<Space> {
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
  log.verbose(`Returning space ${identifier}`)
  return space
}
