import { setGlobalConfig, GlobalConfig } from '@mcro/config'
import { ChildProcess } from 'child_process'
import WebSocket from 'ws'
import root from 'global'
import waitOn from 'wait-on'
import { startChildProcess } from './helpers/startChildProcess'

// this is the entry for every process

root['WebSocket'] = WebSocket
Error.stackTraceLimit = Infinity

const { SUB_PROCESS, PROCESS_NAME, ORBIT_CONFIG, DISABLE_SYNCERS, IGNORE_ELECTRON } = process.env

export async function main() {
  console.log(`starting ${PROCESS_NAME}`)

  // ensure every process gets configuration
  const config: GlobalConfig = ORBIT_CONFIG
    ? JSON.parse(ORBIT_CONFIG)
    : await require('./getInitialConfig').getInitialConfig()
  if (!config) {
    throw new Error('Couldn\'t find config')
  }
  setGlobalConfig(config)

  // if we are in a forked sub-process, we go off and run them
  if (SUB_PROCESS) {
    console.log('starting sub process', SUB_PROCESS)
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
  } else {
    // this means we are the root process, so we run the forks

    // setup process error watching before doing most stuff
    require('./helpers/handleErrors').handleErrors()
    // exit handling
    const { handleExit, setupHandleExit } = require('./helpers/handleExit')

    if (process.env.NODE_ENV === 'development') {
      // in prod electron handles this
      process.on('exit', handleExit)
      process.on('SIGINT', handleExit)
      process.on('SIGSEGV', handleExit)
      process.on('SIGTERM', handleExit)
      process.on('SIGQUIT', handleExit)
    }

    let electronChromeProcess: ChildProcess
    let desktopProcess: ChildProcess
    let syncersProcess: ChildProcess

    // desktop
    desktopProcess = startChildProcess({
      name: 'desktop',
      inspectPort: 9000,
      isNode: true,
    })

    // wait for desktop to start before starting other processes...
    const desktopServerUrl = `http://localhost:${config.ports.server}`
    await waitOn({ resources: [desktopServerUrl] })
    await new Promise(res => setTimeout(res, 100))

    // syncers
    if (!DISABLE_SYNCERS) {
      syncersProcess = startChildProcess({
        name: 'syncers',
        inspectPort: 9003,
        isNode: true,
      })
    }

    // electronChrome
    electronChromeProcess = startChildProcess({
      name: 'electron-chrome',
      inspectPort: 9004,
      inspectPortRemote: 9005,
    })

    // handle exits
    setupHandleExit([desktopProcess, syncersProcess, electronChromeProcess])

    // start main electron process inside this thread (no forking)
    if (IGNORE_ELECTRON !== 'true') {
      await require('./startElectron').startElectron()
    }

    console.log('Started everything!')
  }
}

// self starting
main()
