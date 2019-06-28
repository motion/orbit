import { getGlobalConfig, setGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { ChildProcessProps, startChildProcess } from '@o/orbit-fork-process'
import root from 'global'
import { join } from 'path'
import WebSocket from 'ws'

// sort order important
require('isomorphic-fetch')
require('abortcontroller-polyfill/dist/polyfill-patch-fetch')

// this is the entry for every process

root.WebSocket = WebSocket
require('array.prototype.flatmap').shim()

Error.stackTraceLimit = Infinity

const { SUB_PROCESS, PROCESS_NAME, ORBIT_CONFIG, DISABLE_WORKERS, DISABLE_ELECTRON } = process.env

const log = new Logger('orbit-main')

export async function main() {
  log.info(`starting ${PROCESS_NAME || 'orbit-main'} ${SUB_PROCESS}`)

  // setup config
  if (SUB_PROCESS) {
    setGlobalConfig(JSON.parse(ORBIT_CONFIG))
  } else {
    if (!process.env.CLI_PATH) {
      throw new Error(
        `No CLI_PATH, are you running directly from app? We need to implement this...`,
      )
    }

    // first process, set up initial configuration
    setGlobalConfig(
      await require('./getInitialConfig').getInitialConfig({
        appEntry: join(__dirname, '..', '_', 'main.js'),
        cliPath: process.env.CLI_PATH,
      }),
    )
  }

  const config = getGlobalConfig()

  if (!SUB_PROCESS) {
    // 🐛 for some reason you'll get "directv-tick" consistently on a port
    // EVEN IF port was found to be empty.... killing again helps
    const ports = Object.values(config.ports)
    log.info('Ensuring all ports clear...', ports.join(','))
    const killPort = require('kill-port')
    await Promise.all(ports.map(port => killPort(port).catch(err => err)))
  }

  // if we are in a forked sub-process, we go off and run them
  if (SUB_PROCESS) {
    log.info('starting sub process', SUB_PROCESS)
    switch (SUB_PROCESS) {
      // we run another orbit sub-process for each app you persist
      case 'orbit':
        require('./startElectron').startElectron({ mainProcess: true })
        return
      case 'desktop':
        require('@o/orbit-desktop').main()
        return
      case 'syncers':
        require('@o/orbit-syncers').main()
        return
      case 'electron-menus':
      case 'electron-apps':
        require('./startElectron').startElectron({ mainProcess: false })
      default:
        if (SUB_PROCESS.indexOf('orbit-app-') === 0) {
          require('./startElectron').startElectron({ mainProcess: false })
        }
    }
    return
  }

  // this means we are the root process, so we run the forks

  // setup process error watching before doing most stuff
  require('./helpers/handleErrors').handleErrors()
  // exit handling

  // TODO move this into orbit-fork-process
  // and make it work with other areas where we fork from orbit-fork-process

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
  const setupProcess = (opts: ChildProcessProps) => {
    const p = startChildProcess(opts)
    setupHandleExit(p)
  }

  // start desktop before starting other processes (it runs the server)...
  setupProcess({
    name: 'desktop',
    inspectPort: 9000,
    isNode: true,
  })

  if (DISABLE_ELECTRON !== 'true') {
    log.info('Starting electron...')

    // start main electron process inside this thread (no forking)
    require('./startElectron').startElectron({ mainProcess: true })
  }

  // syncers
  if (!DISABLE_WORKERS) {
    await new Promise(res => setTimeout(res, 1000))
    setupProcess({
      name: 'syncers',
      inspectPort: 9003,
      isNode: true,
      env: {
        RUN_MEDIATOR: 'true',
      },
    })
  } else {
    log.info(`Workers disabled`)
  }

  log.info('Started everything!')
}

if (SUB_PROCESS || process.env.FIRST_RUN === 'true') {
  main()
  process.env.FIRST_RUN = 'false'
}
