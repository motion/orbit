import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { OR_TIMED_OUT, orTimeout, randomString, sleep } from '@o/utils'
import bonjour from 'bonjour'
import execa from 'execa'
import { pathExists, readJSON } from 'fs-extra'
import { join, relative } from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import waitOn from 'wait-on'
import WebSocket from 'ws'

import { addProcessDispose } from './processDispose'
import { configStore } from './util/configStore'

let verbose
export const log = (...args) => verbose && console.log(...args)

export async function commandDev(options: { projectRoot: string; verbose?: boolean }) {
  verbose = options.verbose

  let orbitDesktop = await getOrbitDesktop()
  try {
    const appId = await orbitDesktop.command(AppDevOpenCommand, {
      path: options.projectRoot,
    })
    await orbitDesktop.command(AppOpenWindowCommand, {
      appId,
      isEditing: true,
    })

    addProcessDispose(async () => {
      log('Disposing orbit dev process...')
      await orbitDesktop.command(AppDevCloseCommand, {
        appId,
      })
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
  }
  return
}

async function findBonjourService(type: string, timeout: number): Promise<number | false> {
  let bonjourInstance = bonjour()
  let waitForService = new Promise(resolve => {
    bonjourInstance.findOne({ type }, service => {
      resolve(service.port)
    })
  })
  let service
  try {
    service = await orTimeout(waitForService, timeout)
  } catch (e) {
    if (e !== OR_TIMED_OUT) {
      console.log(`Error finding port ${e.message}`)
      return false
    }
  } finally {
    bonjourInstance.destroy()
  }
  return service
}

async function getOrbitDesktop() {
  let port = await findBonjourService('orbitDesktop', 500)

  if (!port) {
    // run desktop and try again
    if (await runOrbitDesktop()) {
      port = await findBonjourService('orbitDesktop', 10000)
      // adding some sleep so it connects
      await sleep(1000)
    }
  }

  if (!port) {
    console.log(`Couldn't get Orbit to run, check troubleshooting: https://github.com/motion/orbit`)
    return
  }

  const socket = new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
    WebSocket,
    minReconnectionDelay: 1,
  })

  // we want to be sure it opens before we send messages
  await new Promise(res => {
    socket.onopen = res
  })

  return new MediatorClient({
    transports: [new WebSocketClientTransport('cli-client-' + randomString(5), socket)],
  })
}

async function runOrbitDesktop(): Promise<boolean> {
  const isInMonoRepo = await getIsInMonorepo()
  let cmd = configStore.orbitMainPath.get()
  let cwd = process.cwd()

  if (isInMonoRepo) {
    console.log('\nDev mode: wait for webpack. Start with `run orbit-app`...')
    await waitOn({ resources: [`http://localhost:3999`], interval: 150 })
    const monoRoot = join(__dirname, '..', '..', '..')
    const script = join(monoRoot, 'app', 'orbit-main', 'scripts', 'run-orbit.sh')
    cwd = join(script, '..', '..')
    cmd = `./${relative(cwd, script)}`
    configStore.orbitMainPath.set(cmd)
  } else if (!cmd) {
    log('No orbit path found, searching...')
  }

  if (cmd) {
    try {
      log('Running Orbit', cmd, cwd)
      const child = execa(cmd, [], {
        detached: true,
        cwd,
        env: {
          HIDE_ON_START: 'true',
          DISABLE_LOGGING: 'true',
          DISABLE_SYNCERS: 'true',
          DISABLE_MENU: 'true',
          SINGLE_APP_MODE: 'true',
        },
      })

      if (verbose) {
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
      }

      return true
    } catch (e) {
      console.log('Error running', e)
    }
  }

  return false
}

async function getIsInMonorepo() {
  const monorepoPkg = join(__dirname, '..', '..', '..', 'package.json')
  return (await pathExists(monorepoPkg)) && (await readJSON(monorepoPkg)).name === 'orbit-monorepo'
}
