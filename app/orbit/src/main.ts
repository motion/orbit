import { setGlobalConfig, GlobalConfig } from '@mcro/config'
import { ChildProcess } from 'child_process'
import WebSocket from 'ws'
import root from 'global'

root['WebSocket'] = WebSocket

Error.stackTraceLimit = Infinity

// this runs as the entry for both processes
// first electron, then desktop
// this lets us share config more easily
// and also use the bundled electron binary as the entry point
// which lets us pack things into an asar
export async function main() {
  console.log(`starting ${process.env.PROCESS_NAME}`)

  // in sub process get config this way...
  let config: GlobalConfig = process.env.ORBIT_CONFIG ? JSON.parse(process.env.ORBIT_CONFIG) : null

  // if not we're in the root electron process, lets set it up once...
  if (!config) {
    config = await require('./getInitialConfig').getInitialConfig()
  }

  // all processes get config
  setGlobalConfig(config)

  // sub processes!
  const { SUB_PROCESS } = process.env
  if (SUB_PROCESS) {
    console.log('starting sub process', SUB_PROCESS)
    if (!config) {
      throw new Error(`No config for ${SUB_PROCESS}!`)
    }
    switch (SUB_PROCESS) {
      case 'desktop':
        require('@mcro/orbit-desktop').main()
        return
      case 'syncers':
        require('@mcro/orbit-syncers').main()
        return
      case 'electron-chrome':
        require('./startElectron').startElectron()
        return
    }
  }

  // setup process error watching before doing most stuff
  // this only runs in electron process
  // desktop will report errors up to here
  require('./handleErrors').handleErrors()

  // IS IN ELECTRON...

  let electronChromeProcess: ChildProcess
  let desktopProcess: ChildProcess
  let syncersProcess: ChildProcess

  // exit handling
  const { handleExit, setupHandleExit } = require('./handleExit')
  // this works in dev
  process.on('exit', handleExit)
  process.on('SIGINT', handleExit)
  process.on('SIGSEGV', handleExit)
  process.on('SIGTERM', handleExit)
  process.on('SIGQUIT', handleExit)

  // start sub-processes...
  // desktop
  desktopProcess = require('./startDesktop').startDesktop()
  // electronChrome
  electronChromeProcess = require('./startElectronChrome').startElectronChrome()
  // syncers
  if (!process.env.DISABLE_SYNCERS) {
    syncersProcess = require('./startSyncers').startSyncers()
  }

  setupHandleExit([desktopProcess, syncersProcess, electronChromeProcess])

  if (process.env.IGNORE_ELECTRON !== 'true') {
    await require('./startElectron').startElectron()
    console.log('Started Electron!')
  }
}

// self starting
main()
