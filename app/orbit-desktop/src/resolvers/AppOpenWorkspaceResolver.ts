import { Logger, resolveCommand } from '@o/kit'
import { AppOpenWorkspaceCommand, SpaceEntity, UserEntity } from '@o/models'
import { randomAdjective, randomNoun } from '@o/ui'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

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

    // see OrbitAppsManager for other app related sync

    return true
  },
)

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
