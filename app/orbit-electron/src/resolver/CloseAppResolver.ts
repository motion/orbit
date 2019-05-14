import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { CloseAppCommand } from '@o/models'
import { forceKillProcess } from '@o/orbit-fork-process'
import { ChildProcess } from 'child_process'
import { remove } from 'lodash'

const log = new Logger('command:close-app')

type AppProcess = { appId: number; process: ChildProcess }

let appProcesses: AppProcess[] = []

export const CloseAppResolver: any = resolveCommand(CloseAppCommand, async ({ appId }) => {
  killAppProcess(appId)
})

export function addAppProcess(info: AppProcess) {
  appProcesses.push(info)
}

export function killAppProcess(appId: number) {
  log.info('got close app', appProcesses, appId)
  const app = appProcesses.find(x => x.appId === appId)
  appProcesses = remove(appProcesses, x => x.appId === appId)
  if (!app) {
    console.error('No process found for id', appId)
    return
  }
  forceKillProcess(app.process)
}
