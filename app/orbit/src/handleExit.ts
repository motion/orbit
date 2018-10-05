import { cleanupChildren } from './cleanupChildren'
import { once } from 'lodash'
import { ChildProcess } from 'child_process'
import root from 'global'

let processes: ChildProcess[] = []

export const handleExit = once(async () => {
  try {
    console.log('Electron handle exit...')
    for (const process of processes) {
      process.kill()
      try {
        cleanupChildren(process.pid)
      } catch {}
    }
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
