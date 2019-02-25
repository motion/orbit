import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { CloseAppCommand } from '@mcro/models'
import { forceKillProcess } from '@mcro/orbit-fork-process'
import { appProcesses } from '../orbit/OrbitWindow'

const log = new Logger('command:close-app')

export const CloseAppResolver: any = resolveCommand(
  CloseAppCommand,
  async ({ appId }) => {
    log.info('got close app', appProcesses, appId)
    const app = appProcesses.find(x => x.appId === appId)
    if (!app) {
      console.error('No process found for id', appId)
      return
    }
    forceKillProcess(app.process)
  },
)
