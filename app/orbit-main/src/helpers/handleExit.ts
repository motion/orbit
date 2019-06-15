import { Logger } from '@o/logger'
import { cleanupChildren } from '@o/orbit-fork-process'
import { ChildProcess } from 'child_process'
import root from 'global'
import { once } from 'lodash'

let processes: ChildProcess[] = []

const log = new Logger('handleExit')

export const handleExit = once(async () => {
  try {
    log.info('Electron handle exit...', processes.length)
    for (const proc of processes) {
      try {
        cleanupChildren(proc.pid)
      } catch {
        log.info('error killing children for', proc.pid)
      }
      try {
        process.kill(proc.pid)
      } catch {
        log.info('error killing', proc.pid)
      }
    }
    log.info('bye!')
  } catch (err) {
    log.info('error exiting', err)
  }
  process.exit(0)
})

root.handleExit = handleExit

export const setupHandleExit = (x: ChildProcess[]) => {
  processes = x
}
