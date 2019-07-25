import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppOpenWorkspaceCommand, SpaceEntity, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { OrbitDesktopRoot } from '../OrbitDesktopRoot'
import { findOrCreateWorkspace } from './AppCreateWorkspaceResolver'

const log = new Logger('AppOpenWorkspaceResolver')
const Config = getGlobalConfig()

type WorkspaceInfo = {
  identifier: string
}

export function createAppOpenWorkspaceResolver(desktop: OrbitDesktopRoot) {
  return resolveCommand(AppOpenWorkspaceCommand, async options => {
    const { workspaceRoot } = options
    log.info(`Got command ${workspaceRoot}`)

    Desktop.setState({
      workspaceState: {
        workspaceRoot,
      },
    })

    const { identifier } = await loadWorkspace(workspaceRoot)

    // ensure/find space
    const space = await findOrCreateWorkspace({
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
    }

    log.info('got space', space)

    // set user active space
    const user = await getRepository(UserEntity).findOne({})
    user.activeSpace = space.id
    await getRepository(UserEntity).save(user)

    // ensure app bits
    await desktop.orbitAppsManager.updateAppDefinitions(space)

    // run with cli
    log.info(`starting cli workspace ${Config.paths.cli}`)
    const cli = require(Config.paths.cli)

    // now re-run inside desktop, this time CLI in this process knowing we are the daemon
    const wsManager = await cli.commandWs({
      ...options,
      daemon: true,
    })

    desktop.setWorkspaceManager(wsManager)

    return true
  })
}

export async function getCurrentWorkspace() {
  const user = await getRepository(UserEntity).findOne({})
  return await getRepository(SpaceEntity).findOne({
    where: {
      id: user.activeSpace,
    },
  })
}

async function loadWorkspace(path: string): Promise<WorkspaceInfo> {
  const pkg = await readJSON(join(path, 'package.json'))
  return {
    identifier: pkg.name,
  }
}
