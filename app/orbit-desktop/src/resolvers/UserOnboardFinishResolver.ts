import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { UserEntity, UserOnboardFinishCommand } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('command:user-onboard-finish')

export const UserOnboardFinishResolver = resolveCommand(UserOnboardFinishCommand, async () => {
  const user = await getRepository(UserEntity).findOne()
  if (!user) {
    log.info('error - cannot find general user')
    return
  }
  const settings = user.settings
  settings.hasOnboarded = true
  await getRepository(UserEntity).save(user)
})
