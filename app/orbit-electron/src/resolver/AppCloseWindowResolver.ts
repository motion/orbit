import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCloseWindowCommand } from '@o/models'
import { forceKillProcess } from '@o/orbit-fork-process'
import { Electron } from '@o/stores'
import { ChildProcess } from 'child_process'
import { remove } from 'lodash'

const log = new Logger('AppCloseWindowCommand')

type AppProcess = {
  windowId: number
  process: ChildProcess
}

let appProcesses: AppProcess[] = []

export const AppCloseWindowResolver = resolveCommand(
  AppCloseWindowCommand,
  async ({ windowId }) => {
    killAppProcess(windowId)
    Electron.setState({
      appWindows: {
        // "delete" window
        [windowId]: null,
      },
    })
    return {
      type: 'success',
      message: `Closed process ${windowId}`,
    }
  },
)

export function addAppProcess(info: AppProcess) {
  appProcesses.push(info)
}

function killAppProcess(windowId: number) {
  log.info('got close app', appProcesses, windowId)
  const app = appProcesses.find(x => x.windowId === windowId)
  appProcesses = remove(appProcesses, x => x.windowId === windowId)
  if (!app) {
    console.error('No process found for id', windowId)
    return
  }
  forceKillProcess(app.process)
}
