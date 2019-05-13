#!/usr/bin/env node
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { AppDevOpenCommand } from '@o/models'
import { orTimeout, randomString } from '@o/utils'
import bonjour from 'bonjour'
import getPort from 'get-port'
import * as Path from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import WebSocket from 'ws'
import Yargs from 'yargs'

import makeWebpackConfig from './webpack.config'

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

type Bundler = {
  dispose(): void
  host: string
  port: number
}

async function startBundler(options): Promise<Bundler> {
  let config = await makeWebpackConfig(options)
  let compiler = Webpack(config)

  let server = new WebpackDevServer(compiler, config.devServer)
  let serverDispose = () =>
    new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

  let port = await getPort()
  let host = 'localhost'

  return new Promise((resolve, reject) => {
    server.listen(port, host, err => {
      if (err) {
        reject()
      } else {
        resolve({
          host,
          port,
          dispose: serverDispose,
        })
      }
    })
  })
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
    let config = {
      projectRoot: this.options.projectRoot,
      mode: 'development',
    }
    let [bundler, orbitDesktop] = await Promise.all([startBundler(config), getOrbitDesktop()])
    await orbitDesktop.command(AppDevOpenCommand, {
      bundleURL: `http://${bundler.host}:${bundler.port}/bundle.js`,
      path: this.options.projectRoot,
      // @ts-ignore
      appId: this.options.projectRoot,
    })
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

  console.log('test')

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
