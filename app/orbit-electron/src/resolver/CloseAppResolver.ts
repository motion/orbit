import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { CloseAppCommand } from '@mcro/models'

const log = new Logger('CloseAppResolver')

export const CloseAppResolver: any = resolveCommand(
  CloseAppCommand,
  async () => {
    log.info('close this app!!')
  },
)
