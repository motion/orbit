import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { CloseAppCommand } from '@o/models'
import { forceKillProcess } from '@o/orbit-fork-process'
import { appProcesses } from '../orbit/OrbitWindow'

const log = new Logger('command:close-app')

export const CloseAppResolver: any = resolveCommand(CloseAppCommand, async ({ appId }) => {
  log.info('got close app', appProcesses, appId)
  const app = appProcesses.find(x => x.appId === appId)
  if (!app) {
    console.error('No process found for id', appId)
    return
  }
  forceKillProcess(app.process)
})
