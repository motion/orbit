import { getGlobalConfig, setGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { ChildProcessProps, startChildProcess } from '@o/orbit-fork-process'
import root from 'global'
import { join } from 'path'
import WebSocket from 'ws'

import { getInitialConfig } from './getInitialConfig'

// lazy imports for safety/speed (@o/kit is huge, etc)
const lazy = require('laxy')
root.require = lazy(require)
root.require.__proxiedRequire = true

// sort order important
require('isomorphic-fetch')
require('abortcontroller-polyfill/dist/polyfill-patch-fetch')

// temp fix: see gloss/config.js et all
process.env.RENDER_TARGET = 'node'

// never in dev mode on backend processes (think this is right)
root['__DEV__'] = false

// this is the entry for every process

// @ts-ignore
global.WebSocket = WebSocket
require('array-flat-polyfill')

Error.stackTraceLimit = Infinity

const {
  SUB_PROCESS,
  PROCESS_NAME,
  ORBIT_CONFIG,
  DISABLE_WORKERS,
  DISABLE_ELECTRON,
  SINGLE_USE_MODE,
} = process.env

const log = new Logger('orbit-main')

const envInfo = {
  SUB_PROCESS,
  PROCESS_NAME,
  DISABLE_WORKERS,
  DISABLE_ELECTRON,
}

export async function main() {
  log.info(`starting ${PROCESS_NAME || 'orbit-main'} ${SUB_PROCESS}`, envInfo, ORBIT_CONFIG)

  // setup config
  if (SUB_PROCESS) {
    setGlobalConfig(JSON.parse(ORBIT_CONFIG))
  } else {
    // first process, set up initial configuration
    setGlobalConfig(
      await getInitialConfig({
        appEntry: join(__dirname, '..', '_', 'main.js'),
      }),
    )
  }

  const config = getGlobalConfig()

  if (!SUB_PROCESS) {
    // 🐛 for some reason you'll get "directv-tick" consistently on a port
    // EVEN IF port was found to be empty.... killing again helps
    if (!process.env.NO_KILL_PORTS) {
      let ports = [...Object.values(config.ports)]
      if (process.env.NODE_ENV === 'development') {
        // sub-process inspect ports can get stuck
        // dont kill 9006/7 thats *this* process debuggers
        ports = [...ports, 9005, 9008, 9009, 9010]
      }
      log.info('Ensuring all ports clear...', ports.join(','))
      const killPort = require('clear-port')
      await Promise.all(ports.map(port => killPort(port).catch(err => err)))
    }
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
      case 'workers':
        require('@o/orbit-workers').main()
        return
      case 'electron-chrome':
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

  process.on('message', x => x === 'dispose-process' && handleExit())
  process.on('exit', handleExit)
  process.on('SIGINT', handleExit)
  process.on('SIGSEGV', handleExit)
  process.on('SIGTERM', handleExit)
  process.on('SIGQUIT', handleExit)

  // our processes
  // each call pushes the process into the array and then gives them all over to setupHandleExit
  const setupProcess = (opts: ChildProcessProps) => {
    const p = startChildProcess(opts)
    setupHandleExit(opts.name, p)
  }

  // start desktop before starting other processes (it runs the server)...
  setupProcess({
    name: 'desktop',
    inspectPort: 9005,
    isNode: true,
  })

  if (SINGLE_USE_MODE) {
    log.verbose(`Single use mode!, not running other processes`)
  } else {
    // start electron
    if (DISABLE_ELECTRON !== 'true') {
      log.info('Starting electron...')
      // start main electron process inside this thread (no forking)
      require('./startElectron').startElectron({ mainProcess: true })
    }

    // workers
    if (!DISABLE_WORKERS) {
      // i bumped up the wait time here because when you run `orbit ws` the CLI:
      //  1. starts orbit-desktop
      //  2. sends OpenWorkspaceCommand to the resolver
      //  3. that then needs to validate/update the space.directory if it moved
      //  4. if workers runs too quickly it will run its OrbitAppsManager with the wrong space.directory
      //  the ideal fix would be a big refactor of this whole area taking into account many moving pieces
      await new Promise(res => setTimeout(res, 10_000))
      setupProcess({
        name: 'workers',
        inspectPort: 9008,
        isNode: true,
        env: {
          RUN_MEDIATOR: 'true',
        },
      })
    } else {
      log.info(`Workers disabled`)
    }
  }

  if (!process.env.DISABLE_CHROME && process.env.ENABLE_OCR) {
    setupProcess({
      name: 'electron-chrome',
      inspectPort: 9009,
      inspectPortRemote: 9010,
    })
  }

  log.info('Started everything!')
}

if (SUB_PROCESS || process.env.FIRST_RUN === 'true') {
  main()
  process.env.FIRST_RUN = 'false'
}
