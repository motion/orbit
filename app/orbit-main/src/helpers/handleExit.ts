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
        process.kill(proc.pid)
      } catch (err) {
        try {
          cleanupChildren(proc.pid)
        } catch {
          log.info('error killing children for', proc.pid)
        }
      }
    }
    log.info('bye!')
  } catch (err) {
    log.info('error exiting', err)
  }
  process.exit(0)
})

root.handleExit = handleExit

export const setupHandleExit = (x: ChildProcess) => {
  // exit main process if a child process exits unexpectedly
  x.on('close', handleExit)
  x.on('exit', handleExit)
  // clean it up later when this process exits
  processes.push(x)
}
