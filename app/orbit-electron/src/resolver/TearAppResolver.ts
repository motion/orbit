import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { TearAppCommand } from '@mcro/models'

const log = new Logger('TearAppResolver')

export const TearAppResolver: any = resolveCommand(
  TearAppCommand,
  async () => {
    log.info('tear this app!!')
  },
)
