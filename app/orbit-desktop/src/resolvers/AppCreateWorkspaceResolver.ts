import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateWorkspaceCommand, SpaceEntity } from '@o/models'
import { randomAdjective, randomNoun } from '@o/ui'
import { getRepository } from 'typeorm'

const log = new Logger('createWorkspace')

export const AppCreateWorkspaceResolver = resolveCommand(AppCreateWorkspaceCommand, async props => {
  await findOrCreateWorkspace(props)
  return true
})

export async function findOrCreateWorkspace(props: { identifier?: string; directory?: string }) {
  log.info(`looking for space`, props)

  const ws = await getRepository(SpaceEntity).findOne({
    where: {
      identifier: props.identifier,
    },
  })

  log.info('Find or create space', props, 'found?', !!ws)

  if (ws) {
    return ws
  }

  const space = await getRepository(SpaceEntity).save({
    name: `${randomAdjective()} ${randomNoun()}`,
    colors: ['orange', 'pink'],
    paneSort: [],
    onboarded: false,
    ...props,
  })

  // the default home app will be made on app startup, see om/apps.ts

  return space
}
