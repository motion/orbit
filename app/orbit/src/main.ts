import { setGlobalConfig, GlobalConfig } from '@mcro/config'
import { cleanupChildren } from './cleanupChildren'
import { ChildProcess } from 'child_process'
import WebSocket from 'ws'
import root from 'global'
import { once } from 'lodash'

root['WebSocket'] = WebSocket

Error.stackTraceLimit = Infinity

// this runs as the entry for both processes
// first electron, then desktop
// this lets us share config more easily
// and also use the bundled electron binary as the entry point
// which lets us pack things into an asar
export async function main() {
  console.log(`starting ${process.env.PROCESS_NAME}`)

  // if were in desktop we get config through here
  let config: GlobalConfig = process.env.ORBIT_CONFIG ? JSON.parse(process.env.ORBIT_CONFIG) : null

  // if not we're in the root electron process, lets set it up once...
  if (!config) {
    config = await require('./getInitialConfig').getInitialConfig()
  }

  // both processes now run this part to have their config setup
  setGlobalConfig(config)

  // IS IN DESKTOP
  // go off and do its thing...
  if (process.env.IS_DESKTOP) {
    if (!config) {
      throw new Error('Desktop didn\'t receive config!')
    }
    // lets run desktop now
    require('@mcro/orbit-desktop').main()
    // dont keep running
    return
  } else if (process.env.IS_SYNCERS) {
    if (!config) {
      throw new Error('Syncers didn\'t receive config!')
    }
    // lets run syncers now
    require('@mcro/orbit-syncers').main()
    // dont keep running
    return
  }

  // setup process error watching before doing most stuff
  // this only runs in electron process
  // desktop will report errors up to here
  require('./handleErrors').handleErrors()

  // IS IN ELECTRON...

  let desktopProcess: ChildProcess
  let syncersProcess: ChildProcess

  const handleExit = once(async () => {
    try {
      console.log('Electron handle exit...')
      desktopProcess.kill('SIGINT')
      syncersProcess.kill('SIGINT')
      try {
        cleanupChildren(desktopProcess.pid)
        cleanupChildren(syncersProcess.pid)
        cleanupChildren(process.pid)
      } catch {}
      console.log('bye!')
    } catch (err) {
      // exec('pkill -9 Orbit')
      process.exit(0)
    }
  })

  // this works in dev
  process.on('exit', handleExit)
  process.on('SIGINT', handleExit)
  process.on('SIGSEGV', handleExit)
  process.on('SIGTERM', handleExit)
  process.on('SIGQUIT', handleExit)

  // fork desktop process...
  desktopProcess = require('./startDesktop').startDesktop()
  syncersProcess = require('./startSyncers').startSyncers()

  console.log('WHAT')

  if (process.env.IGNORE_ELECTRON !== 'true') {
    await require('./startElectron').startElectron(handleExit)
    console.log('Started Electron!')
  }
}

// self starting
main()
