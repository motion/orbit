import { exec } from 'child_process'
import { cleanupChildren } from './cleanupChildren'
import { ChildProcessProps, startChildProcess } from './startChildProcess'

export { ChildProcessProps, startChildProcess } from './startChildProcess'

export async function forkProcess(props: ChildProcessProps) {
  const proc = startChildProcess(props)

  function handleExit() {
    try {
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
      console.log('for now brute force killing..')
      exec('pkill -9 screen')
      console.log('bye!')
    } catch (err) {
      console.log('error exiting', err)
    }
    process.exit(0)
  }

  process.on('exit', handleExit)
  process.on('SIGINT', handleExit)
  process.on('SIGKILL', handleExit)
}
