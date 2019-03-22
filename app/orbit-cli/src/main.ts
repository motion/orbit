#!/usr/bin/env node

// XXX(andreypopp): using require here because it's outside of ts's rootDir and
// ts complains otherwise
const packageJson = require('../package.json');

import Yargs from 'yargs'

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

  async dev(opts: {}) {
    console.log('dev', opts)
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
  let getCommonOptions = _argv => {
    let projectRoot = process.cwd();
    return {projectRoot}
  }

  const configure = (p, ...options) => {
    for (let option of options) {
      p = option(p)
    }
    return p
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
      p => configure(p, app),
      async argv => {
        let options = getCommonOptions(argv)
        await withOrbitCLI(options, app => {
          return app.dev(argv)
        })
      },
    )
    .version(version, description)
    .help().argv
}

main()
