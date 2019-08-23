import { Logger } from '@o/logger'
import { cleanupChildren } from '@o/orbit-fork-process'
import { ChildProcess } from 'child_process'
import root from 'global'
import { once } from 'lodash'

let processes: { name: string; proc: ChildProcess }[] = []

const log = new Logger('handleExit')

export const handleExit = once(async () => {
  try {
    log.info(`Electron handle exit... stopping ${processes.length} processes`)
    for (const { name, proc } of processes) {
      try {
        log.info(`Killing ${name}`)
        process.kill(-proc.pid)
      } catch (err) {
        log.info('kill err', err)
        try {
          cleanupChildren(proc.pid)
          process.kill(proc.pid)
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

export const setupHandleExit = (name: string, proc: ChildProcess) => {
  // exit main process if a child process exits unexpectedly
  proc.on('close', () => {
    log.info(`Process closed ${name}`)
    handleExit()
  })
  proc.on('exit', () => {
    log.info(`Process exited ${name}`)
    handleExit()
  })
  // clean it up later when this process exits
  processes.push({ proc, name })
}
