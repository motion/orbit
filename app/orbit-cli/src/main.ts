#!/usr/bin/env node
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { orTimeout, randomString } from '@o/utils'
import bonjour from 'bonjour'
import * as Path from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'
import Yargs from 'yargs'

// XXX(andreypopp): using require here because it's outside of ts's rootDir and
// ts complains otherwise
const packageJson = require('../package.json')

let cwd = process.cwd()
let version = packageJson.version
let description = `Orbit v${version} - Build Amazing Apps Together`

type Options = {
  projectRoot: string
}

async function findBonjourService(type: string, timeout: number) {
  let bonjourInstance = bonjour()
  let waitForService = new Promise(resolve => {
    bonjourInstance.findOne({ type: type }, service => {
      resolve(service.port)
    })
  })
  let service
  try {
    service = await orTimeout(waitForService, timeout)
  } finally {
    bonjourInstance.destroy()
  }
  return service
}

async function getOrbitDesktop() {
  let port = await findBonjourService('orbitDesktop', 5000)

  if (port == null) {
    // TODO(andreypopp): start orbit instead
    throw new Error('orbit-desktop is not running')
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

class OrbitCLI {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  async dev(_opts: {}) {
    let orbitDesktop = await getOrbitDesktop()
    const appId = await orbitDesktop.command(AppDevOpenCommand, {
      path: this.options.projectRoot,
    })
    console.log('sent dev command, got app', appId)
    await orbitDesktop.command(AppOpenWindowCommand, {
      appId,
    })
    console.log('opening app window id', appId)
    return
  }
}

function main() {
  async function withOrbitCLI(options: Options, f: (OrbitCLI) => Promise<void>) {
    let orbit: OrbitCLI
    try {
      orbit = await new OrbitCLI(options)
      await f(orbit)
    } catch (error) {
      console.error(error)
      process.exit(2)
    }
  }

  const app = (p: Yargs.Argv) =>
    p.positional('app', {
      type: 'string',
      default: '.',
      describe: 'The application to run',
    })

  Yargs.scriptName('orbit')
    .usage('$0 <cmd> [args]')
    .command(
      'dev [app]',
      'Run an Orbit app in development mode',
      p => app(p),
      async argv => {
        let projectRoot = Path.resolve(cwd, argv.app)
        let options = { projectRoot }
        // @ts-ignore
        await withOrbitCLI(options, app => {
          return app.dev(argv)
        })
      },
    )
    .version('version', 'Show version', description)
    .help().argv
}

main()
