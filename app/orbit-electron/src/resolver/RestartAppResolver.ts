import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { RestartAppCommand } from '@o/models'
import { app } from 'electron'

const log = new Logger('command:restart-app')

export const RestartAppResolver: any = resolveCommand(RestartAppCommand, async () => {
  log.info('restarting app...')
  app.relaunch()
  app.exit()
})
