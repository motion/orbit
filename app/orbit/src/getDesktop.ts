import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { OrbitProcessStdOutModel } from '@o/models'
import { OR_TIMED_OUT, orTimeout, randomString } from '@o/utils'
import bonjour from 'bonjour'
import { ChildProcess } from 'child_process'
import execa from 'execa'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

import { cliPath } from './constants'
import { addProcessDispose } from './processDispose'
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
  const isInMonoRepo = await getIsInMonorepo()
  let port = 0
  let orbitProcess: ChildProcess | null = null
  let didFindOrbit = false
  let didStartOrbit = false

  await Promise.all([
    (async function findOrbit() {
      const foundPort = await findBonjourService('orbitDesktop', 180)
      if (foundPort) {
        port = foundPort
        didFindOrbit = true
      }
    })(),
    (async function preloadOrbit() {
      reporter.info('🌒 Starting Orbit.app (optimistic start)')
      orbitProcess = runOrbitDesktop(props, isInMonoRepo)
    })(),
  ])

  if (didFindOrbit) {
    // cancel optimistic start, we found existing
    if (orbitProcess) {
      process.kill(-orbitProcess.pid)
    }
  } else {
    if (orbitProcess) {
      reporter.verbose(`Didn't find existing Orbit, using current`)
      const found = await findBonjourService('orbitDesktop', 15000)
      if (found) {
        port = found
        reporter.verbose(`Started orbit on port ${port}`)
        didStartOrbit = true
      }
    }
  }

  if (port) {
    reporter.info(`Found existing orbit process`)
  } else {
    reporter.panic(`Couldn't find or start Orbit!`)
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

  if (!isInMonoRepo) {
    // in dev mode connect to orbit process and pipe logs here for easy debug
    const model = mediator.observeOne(OrbitProcessStdOutModel, undefined).subscribe(msg => {
      reporter.verbose(`> ${msg}`)
    })
    addProcessDispose(() => model.unsubscribe())
  }

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
    reporter.verbose(`Finding bounjour service ${type}`)
    bonjourInstance.findOne({ type }, service => {
      reporter.verbose(`bonjour got ${service.type} ${service.port}`)
      resolve(service.port)
    })
  })
  let service
  try {
    service = await orTimeout(waitForService, timeout)
  } catch (e) {
    if (e === OR_TIMED_OUT) {
      reporter.verbose(`Timed out ${type} ${timeout}`)
      return null
    } else {
      reporter.panic(`Error finding bonjour ${e.message}`)
    }
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
    cmd = `npx electron --async-stack-traces --inspect=9006 --remote-debugging-port=9007 ./_/main.js`
  } else {
    throw new Error(`TODO Production mode`)
  }

  if (!cmd) {
    reporter.info('No orbit path found, searching...')
  }

  if (cmd) {
    try {
      console.log(`⚠️   remove NODE_ENV env here once we get proper electron 8 build`)
      // detached should keep it running as a daemon basically, which we want in production mode
      // TODO could make singleUseMode actually start it properly, but that would be tricky because we'd
      // want to avoid doing extra work initially, and then later "start" the rest of orbit (non singleUseMode stufg)
      const detached = !singleUseMode
      reporter.verbose(`Running Orbit ${cmd} in ${cwd}, detached? ${detached}`)
      const child = execa.command(cmd, {
        detached,
        all: true,
        cwd,
        env: {
          ...process.env,
          ...(singleUseMode && { SINGLE_USE_MODE: 'true' }),
          ...(isInMonoRepo && {
            FIRST_RUN: 'true', // runs it when in monorepo mode
          }),
          HIDE_ON_START: 'true',
          CLI_PATH: cliPath,
          // TODO we can remove this
          NODE_ENV: 'development',
        },
      })

      if (isInMonoRepo) {
        console.log('Dev mode helper enabled: CTRL+C will kill Orbit daemon.')
        addProcessDispose({
          action: 'SIGINT',
          dispose: () => {
            reporter.verbose('dispose-process orbit')
            process.kill(-child.pid)
          },
        })
      }

      if (reporter.isVerbose) {
        // all fixed a bug where it would stop piping from stdio/stderr
        child.all.pipe(process.stdout)
      }

      return child
    } catch (e) {
      console.log('Error running', e)
    }
  }

  return null
}
