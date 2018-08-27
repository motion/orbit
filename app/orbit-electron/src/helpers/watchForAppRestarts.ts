import { check } from 'tcp-port-used'
import touch from 'touch'

export function watchForAppRestarts() {
  // watch for parcel restarts, then restart electron
  let shouldRestart = false
  const int = setInterval(async () => {
    const webRunning = await check(3999, '127.0.0.1')
    if (!webRunning && !shouldRestart) {
      console.log('app down, will restart on next app startup')
      shouldRestart = true
    }
    if (shouldRestart && webRunning) {
      const touchFile = require('path').join(__dirname, '..', '_', 'index.js')
      console.log('restarting after parcel cycle...', touchFile)
      touch(touchFile)
      clearInterval(int)
    }
  }, 1000)
  return {
    dispose: () => clearInterval(int),
  }
}
