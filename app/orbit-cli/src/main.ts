#!/usr/bin/env node
import './processDispose'

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
  Yargs.scriptName('orbit')
    .usage('$0 <cmd> [args]')
    .command(
      'dev [app]',
      'Run an Orbit app in development mode',
      p =>
        p.positional('app', {
          type: 'string',
          default: '.',
          describe: 'The application to run',
        }),
      async argv => {
        let projectRoot = Path.resolve(cwd, argv.app)
        commandDev({ projectRoot, verbose: !!argv.verbose })
      },
    )
    .option('verbose', {
      alias: 'v',
    })
    .version('version', 'Show version', description)
    .showHelpOnFail(true)
    .help().argv
}

main()
