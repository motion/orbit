import { fork } from 'child_process'
import { join } from 'path'

export const flush = async () => {
  // Submit events on background w/o blocking the main process
  // nor relying on it's lifecycle
  const forked = fork(join(__dirname, `send.js`), {
    // @ts-ignore
    detached: true,
    stdio: `ignore`,
    execArgv: [],
  })
  forked.unref()
}
