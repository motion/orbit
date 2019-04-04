import { ChildProcess, exec } from 'child_process'
import { cleanupChildren } from './cleanupChildren'
import { ChildProcessProps, startChildProcess } from './startChildProcess'

export { cleanupChildren } from './cleanupChildren'
export { ChildProcessProps, startChildProcess } from './startChildProcess'

export function forkProcess(props: ChildProcessProps): ChildProcess {
  const proc = startChildProcess(props)
  // commented for now since ./bin/orbit dev fails because of them
  // process.on('exit', () => forceKillProcess(proc))
  // process.on('SIGINT', () => forceKillProcess(proc))
  // process.on('SIGKILL', () => forceKillProcess(proc))
  return proc
}

export function forceKillProcess(proc: ChildProcess) {
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
