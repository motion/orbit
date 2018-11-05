import { cleanupChildren } from './cleanupChildren'
import { once } from 'lodash'
import { ChildProcess, exec } from 'child_process'
import root from 'global'

let processes: ChildProcess[] = []

export const handleExit = once(async () => {
  try {
    console.log('Electron handle exit...')
    for (const proc of processes) {
      try {
        cleanupChildren(proc.pid)
      } catch {
        console.log('error killing children for', proc.pid)
      }
      try {
        process.kill(proc.pid)
      } catch {
        console.log('error killing', proc.pid)
      }
    }
    console.log('for now brute force killing..')
    exec('pkill -9 oracle')
    console.log('bye!')
  } catch (err) {
    console.log('error exiting', err)
  }
  process.exit(0)
})

root.handleExit = handleExit

export const setupHandleExit = (x: ChildProcess[]) => {
  processes = x
}
