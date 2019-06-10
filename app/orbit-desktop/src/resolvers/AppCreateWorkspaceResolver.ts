import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateWorkspaceCommand, SpaceEntity } from '@o/models'
import { randomAdjective, randomNoun } from '@o/ui'
import { getRepository } from 'typeorm'

const log = new Logger('createWorkspace')

export const ChangeDesktopThemeResolver = resolveCommand(
  AppCreateWorkspaceCommand,
  findOrCreateWorkspace,
)

export async function findOrCreateWorkspace(props) {
  log.info(`looking for space`, props)

  const ws = await getRepository(SpaceEntity).findOne({
    where: {
      identifier: props.identifier,
    },
  })

  log.info('Find or create space', props, 'found?', !!ws)

  if (ws) {
    // moved!
    if (ws.directory !== props.directory) {
      console.log('directory seems to have moved, we should prompt and allow choice')
    }
    return ws
  }

  return await getRepository(SpaceEntity).save({
    name: `${randomAdjective()} ${randomNoun()}`,
    colors: ['orange', 'pink'],
    paneSort: [],
    onboarded: false,
    ...props,
  })
}
