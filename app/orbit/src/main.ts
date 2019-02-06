import { getGlobalConfig, setGlobalConfig } from '@mcro/config'
import { ChildProcessProps, startChildProcess } from '@mcro/orbit-fork-process'
import { ChildProcess } from 'child_process'
import root from 'global'
import { join } from 'path'
import waitOn from 'wait-on'
import WebSocket from 'ws'

// sort order important
require('isomorphic-fetch')
require('abortcontroller-polyfill/dist/polyfill-patch-fetch')

// this is the entry for every process

root['WebSocket'] = WebSocket
Error.stackTraceLimit = Infinity

const { SUB_PROCESS, PROCESS_NAME, ORBIT_CONFIG, DISABLE_SYNCERS, IGNORE_ELECTRON } = process.env

export async function main() {
  console.log(`starting ${PROCESS_NAME}`)

  // setup config
  if (SUB_PROCESS) {
    setGlobalConfig(JSON.parse(ORBIT_CONFIG))
  } else {
    // first process, set up initial configuration
    setGlobalConfig(
      await require('./getInitialConfig').getInitialConfig({
        appEntry: join(__dirname, '..', '_', 'main.js'),
      }),
    )
  }

  const config = getGlobalConfig()

  if (process.env.FIRST_RUN === 'true') {
    // 🐛 for some reason you'll get "directv-tick" consistently on a port
    // EVEN IF port was found to be empty.... killing again helps
    try {
      const ports = Object.values(config.ports)
      console.log('Ensuring all ports clear...', ports)
      const killPort = require('kill-port')
      await Promise.all(ports.map(port => killPort(port)))
    } catch {
      // errors just show the ports empty
    }
  }

  // if we are in a forked sub-process, we go off and run them
  if (SUB_PROCESS) {
    console.log('starting sub process', SUB_PROCESS)
    switch (SUB_PROCESS) {
      // we run another orbit sub-process for each app you persist
      case 'orbit':
        require('./startElectron').startElectron({ mainProcess: true })
        return
      case 'desktop':
        require('@mcro/orbit-desktop').main()
        return
      case 'syncers':
        require('@mcro/orbit-syncers').main()
        return
      case 'electron-menus':
      case 'electron-apps':
        require('./startElectron').startElectron({ mainProcess: false })
        return
    }
  } else {
    // this means we are the root process, so we run the forks

    // setup process error watching before doing most stuff
    require('./helpers/handleErrors').handleErrors()
    // exit handling
    const { handleExit, setupHandleExit } = require('./helpers/handleExit')

    if (process.env.NODE_ENV === 'development') {
      // in prod electron handles thishandleErrors
      process.on('exit', handleExit)
      process.on('SIGINT', handleExit)
      process.on('SIGSEGV', handleExit)
      process.on('SIGTERM', handleExit)
      process.on('SIGQUIT', handleExit)
    }

    // our processes
    // each call pushes the process into the array and then gives them all over to setupHandleExit
    let processes: ChildProcess[] = []
    const setupProcess = (opts: ChildProcessProps) => {
      const p = startChildProcess(opts)
      processes.push(p)
      setupHandleExit(processes)
    }

    // start desktop before starting other processes (it runs the server)...
    setupProcess({
      name: 'desktop',
      inspectPort: 9000,
      isNode: true,
    })

    // syncers
    // start before web processes because they connect to it
    if (!DISABLE_SYNCERS) {
      setupProcess({
        name: 'syncers',
        inspectPort: 9003,
        isNode: true,
      })
    }

    // wait for server...
    const desktopServerUrl = `http://localhost:${config.ports.server}`
    await waitOn({ resources: [desktopServerUrl] })

    console.log('Desktop has started, continuing starting electron processes...')

    if (IGNORE_ELECTRON !== 'true') {
      // start main electron process inside this thread (no forking)
      require('./startElectron').startElectron({ mainProcess: true })

      // sleep a bit this is a shitty way to avoid bugs starting multiple electron instances at once
      // see: https://github.com/electron/electron/issues/7246

      await new Promise(res => setTimeout(res, 500))

      if (!process.env.IGNORE_MENU) {
        setupProcess({
          name: 'electron-menus',
          inspectPort: 9006,
          inspectPortRemote: 9007,
        })

        await new Promise(res => setTimeout(res, 500))

        if (!process.env.IGNORE_APPS) {
          setupProcess({
            name: 'electron-apps',
            inspectPort: 9004,
            inspectPortRemote: 9005,
          })
        }
      }
    }

    console.log('Started everything!')
  }
}

if (SUB_PROCESS || process.env.FIRST_RUN === 'true') {
  main()
  process.env.FIRST_RUN = 'false'
}
