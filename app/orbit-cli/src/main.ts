#!/usr/bin/env node
import * as Path from 'path'
import Yargs from 'yargs'

import { commandDev } from './command-dev'

// XXX(andreypopp): using require here because it's outside of ts's rootDir and
// ts complains otherwise
const packageJson = require('../package.json')

let cwd = process.cwd()
let version = packageJson.version
let description = `Orbit v${version} - Build Amazing Apps Together`

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
        commandDev(options)
      },
    )
    .version('version', 'Show version', description)
    .help().argv
}

main()
