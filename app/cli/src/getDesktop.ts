import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { OR_TIMED_OUT, orTimeout, randomString, sleep } from '@o/utils'
import bonjour from 'bonjour'
import execa from 'execa'
import killPort from 'kill-port'
import { join, relative } from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

import { reporter } from './reporter'
import { configStore } from './util/configStore'
import { getIsInMonorepo } from './util/getIsInMonorepo'

let tries = 0

export async function getOrbitDesktop() {
  let port = await findBonjourService('orbitDesktop', 500)

  if (!port) {
    reporter.info('Starting orbit desktop process')
    // run desktop and try again
    if (await runOrbitDesktop()) {
      port = await findBonjourService('orbitDesktop', 25000)
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
  try {
    reporter.info('Waiting for socket connection')
    await orTimeout(
      new Promise(res => {
        if (socket.readyState === 1) res()
        else {
          socket.onopen = res
        }
      }),
      1000,
    )
  } catch (err) {
    if (err === OR_TIMED_OUT) {
      if (tries >= 1) {
        console.error(
          `Couldn't connect to Orbit, please report an issue on https://github.com/motion/orbit/issues`,
        )
        return
      }
      reporter.info(
        'Timed out waiting for socket to open, potentially stuck Orbit process, attempting restart.',
      )
      await killPort(port)
      tries++
      return await getOrbitDesktop()
    } else {
      reporter.error(err.message, err)
    }
  }

  const mediator = new MediatorClient({
    transports: [new WebSocketClientTransport('cli-client-' + randomString(5), socket)],
  })

  return mediator
}

async function findBonjourService(type: string, timeout: number): Promise<number | false> {
  let bonjourInstance = bonjour()
  let waitForService = new Promise(resolve => {
    reporter.info('Finding bounjour service', type)
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
    reporter.info('Timed out finding bonjour')
  } finally {
    bonjourInstance.destroy()
  }
  return service
}

export async function runOrbitDesktop(): Promise<boolean> {
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
    reporter.info('No orbit path found, searching...')
  }

  if (cmd) {
    try {
      reporter.info('Running Orbit', cmd, cwd)
      const child = execa(cmd, [], {
        detached: !isInMonoRepo,
        cwd,
        env: {
          HIDE_ON_START: 'true',
          DISABLE_LOGGING: 'true',
          DISABLE_WORKERS: 'true',
          DISABLE_MENU: 'true',
          SINGLE_APP_MODE: 'true',
        },
      })

      if (reporter.isVerbose) {
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
