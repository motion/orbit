import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { OR_TIMED_OUT, orTimeout, randomString, sleep } from '@o/utils'
import bonjour from 'bonjour'
import { exec } from 'child_process'
import { pathExists, readJSON } from 'fs-extra'
import { join, relative } from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

import { configStore } from './util/configStore'

export async function commandDev(options: { projectRoot: string }) {
  let orbitDesktop = await getOrbitDesktop()
  const appId = await orbitDesktop.command(AppDevOpenCommand, {
    path: options.projectRoot,
  })
  console.log('sent dev command, got app', appId)
  await orbitDesktop.command(AppOpenWindowCommand, {
    appId,
  })
  console.log('opening app window id', appId)
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
      port = await findBonjourService('orbitDesktop', 4500)
    }
  }
  if (!port) {
    console.log(`Couldn't get Orbit to run, check troubleshooting: https://github.com/motion/orbit`)
    return
  }

  console.log(`orbit-desktop found at ${port} connecting...`)
  let Mediator = new MediatorClient({
    transports: [
      new WebSocketClientTransport(
        'cli-client-' + randomString(5),
        new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
          WebSocket,
          minReconnectionDelay: 1,
        }),
      ),
    ],
  })
  return Mediator
}

async function runOrbitDesktop(): Promise<boolean> {
  const isInMonoRepo = await getIsInMonorepo()
  let runPath = configStore.orbitMainPath.get()
  let cwd = __dirname

  if (isInMonoRepo) {
    const monoRoot = join(__dirname, '..', '..', '..')
    const script = join(monoRoot, 'app', 'orbit-main', 'scripts', 'run-orbit.sh')
    cwd = join(script, '..', '..')
    runPath = `./${relative(cwd, script)}`
    configStore.orbitMainPath.set(runPath)
    // wait a bit longer, in dev mode startup is slower
    await sleep(2000)
  } else if (!runPath) {
    console.log('No orbit path found, searching...')
  }

  if (runPath) {
    try {
      console.log('Running Orbit', runPath, cwd)
      exec(runPath, isInMonoRepo ? { cwd } : null, (/* err, stdout, stderr */) => {
        // console.log('exec res', err, stdout, stderr)
      })
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
