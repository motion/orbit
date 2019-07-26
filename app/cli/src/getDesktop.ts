import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { OR_TIMED_OUT, orTimeout, randomString } from '@o/utils'
import bonjour from 'bonjour'
import { ChildProcess } from 'child_process'
import execa from 'execa'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

import { cliPath } from './constants'
import { reporter } from './reporter'

export type GetOrbitDesktopProps = {
  singleUseMode?: boolean
}

export async function getOrbitDesktop(
  props: GetOrbitDesktopProps = {},
): Promise<{
  mediator: MediatorClient
  didStartOrbit: boolean
  orbitProcess: ChildProcess | null
}> {
  let port = await findBonjourService('orbitDesktop', 120)
  let didStartOrbit = false
  let orbitProcess: ChildProcess | null = null

  if (port) {
    reporter.info(`Found existing orbit process`)
  } else {
    reporter.info('Orbit not running, starting Orbit.app')
    // run desktop and try again
    const isInMonoRepo = await getIsInMonorepo()
    orbitProcess = runOrbitDesktop(props, isInMonoRepo)
    if (orbitProcess) {
      port = await findBonjourService('orbitDesktop', 15000)
      didStartOrbit = true
    }
  }

  if (!port) {
    reporter.panic(`Couldn't get Orbit to run`)
  }

  reporter.verbose(`Connecting to orbit desktop on port ${port}`)

  const socket = new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
    WebSocket,
    minReconnectionDelay: 1,
  })
  const transport = new WebSocketClientTransport('cli-client-' + randomString(5), socket)
  const mediator = new MediatorClient({
    transports: [transport],
  })
  await transport.onOpen()

  if (!mediator) {
    reporter.panic('No mediator found')
  }

  return {
    mediator,
    didStartOrbit,
    orbitProcess,
  }
}

async function findBonjourService(type: string, timeout: number): Promise<number | false> {
  let bonjourInstance = bonjour()
  let waitForService = new Promise(resolve => {
    reporter.verbose('Finding bounjour service', type)
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
    reporter.verbose('Timed out finding bonjour')
  } finally {
    bonjourInstance.destroy()
  }
  return service
}

async function getIsInMonorepo() {
  const monorepoPkg = join(__dirname, '..', '..', '..', 'package.json')
  return (await pathExists(monorepoPkg)) && (await readJSON(monorepoPkg)).name === 'orbit-monorepo'
}

// weirdly, if i made this async, it never returned (when isInMonoRepo)
// ..oh i know why.... because execa returns a weird promise, so it awaits the promise :(
export function runOrbitDesktop(
  { singleUseMode }: GetOrbitDesktopProps,
  isInMonoRepo,
): ChildProcess | null {
  reporter.verbose(`runOrbitDesktop, isInMonoRepo ${isInMonoRepo}`)
  let cmd = ''
  let cwd = process.cwd()

  if (isInMonoRepo) {
    const monoRoot = join(__dirname, '..', '..', '..')
    cwd = join(monoRoot, 'app', 'orbit-main')
    cmd = `npx electron --async-stack-traces --inspect=9001 --remote-debugging-port=9002 ./_/main.js`
  }
  if (!cmd) {
    reporter.info('No orbit path found, searching...')
  }

  if (cmd) {
    try {
      // detached should keep it running as a daemon basically, which we want in production mode
      const detached = !isInMonoRepo
      reporter.verbose(`Running Orbit ${cmd} in ${cwd}, detached? ${detached}`)
      const child: ChildProcess = execa.command(cmd, {
        detached,
        cwd,
        env: {
          ...process.env,
          ...(singleUseMode && { SINGLE_USE_MODE: 'true' }),
          ...(isInMonoRepo && {
            FIRST_RUN: 'true', // runs it when in monorepo mode
            NODE_ENV: 'development',
          }),
          HIDE_ON_START: 'true',
          SINGLE_APP_MODE: 'true',
          CLI_PATH: cliPath,
        },
      })

      if (reporter.isVerbose) {
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
      }

      return child
    } catch (e) {
      console.log('Error running', e)
    }
  }

  return null
}
