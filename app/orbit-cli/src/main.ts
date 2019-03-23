#!/usr/bin/env node

// XXX(andreypopp): using require here because it's outside of ts's rootDir and
// ts complains otherwise
const packageJson = require('../package.json')

import * as Path from 'path'
import Yargs from 'yargs'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import makeWebpackConfig from './webpack.config'

let cwd = process.cwd()
let version = packageJson.version
let description = `Orbit v${version} - Build Amazing Apps Together`

type Options = {
  projectRoot: string
}

class OrbitCLI {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  async initialize() {}

  dispose() {}

  async dev(_opts: {}) {
    let config = await makeWebpackConfig({
      projectRoot: this.options.projectRoot,
      mode: 'development',
    })
    console.log('webpack config:')
    console.log({ context: config.context, entry: config.entry })
    let compiler = Webpack(config)
    let server = new WebpackDevServer(compiler, config.devServer)
    let port = 9000
    let host = 'localhost'
    return new Promise((_resolve, reject) => {
      server.listen(port, host, err => {
        if (err) {
          reject()
        } else {
          console.log(`Server started at ${host}:${port}`)
        }
      })
    })
  }
}

async function withOrbitCLI(options: Options, f: (OrbitCLI) => Promise<void>) {
  let orbit: OrbitCLI
  let exitCode = 1
  try {
    orbit = await new OrbitCLI(options)
    await orbit.initialize()
    await f(orbit)
  } catch (error) {
    exitCode = 2
    console.error(error)
  } finally {
    if (orbit) {
      orbit.dispose()
    }
    process.exit(exitCode)
  }
}

function main() {
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
