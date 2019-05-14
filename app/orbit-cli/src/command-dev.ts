import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { OR_TIMED_OUT, orTimeout, randomString, sleep } from '@o/utils'
import bonjour from 'bonjour'
import execa from 'execa'
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
    isEditing: true,
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
      port = await findBonjourService('orbitDesktop', 8500)
    }
  }

  if (!port) {
    console.log(`Couldn't get Orbit to run, check troubleshooting: https://github.com/motion/orbit`)
    return
  }

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
  let cmd = configStore.orbitMainPath.get()
  let cwd = process.cwd()

  if (isInMonoRepo) {
    const monoRoot = join(__dirname, '..', '..', '..')
    const script = join(monoRoot, 'app', 'orbit-main', 'scripts', 'run-orbit.sh')
    cwd = join(script, '..', '..')
    cmd = `./${relative(cwd, script)}`
    configStore.orbitMainPath.set(cmd)
  } else if (!cmd) {
    console.log('No orbit path found, searching...')
  }

  if (cmd) {
    try {
      console.log('Running Orbit', cmd, cwd)
      const child = execa(cmd, [], {
        cwd,
        env: {
          HIDE_ON_START: 'true',
          DISABLE_LOGGING: 'true',
          DISABLE_SYNCERS: 'true',
          DISABLE_MENU: 'true',
        },
      })

      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)

      if (isInMonoRepo) {
        // wait a bit longer, in dev mode startup is slower
        await sleep(2000)
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
