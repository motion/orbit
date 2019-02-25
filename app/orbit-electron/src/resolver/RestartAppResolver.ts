import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { RestartAppCommand } from '@mcro/models'
import { app } from 'electron'

const log = new Logger('command:restart-app')

export const RestartAppResolver: any = resolveCommand(
  RestartAppCommand,
  async () => {
    log.info('restarting app...')
    app.relaunch()
    app.exit()
  },
)
