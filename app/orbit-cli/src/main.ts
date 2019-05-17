#!/usr/bin/env node
import './processDispose'

import { readJSON } from 'fs-extra'
import * as Path from 'path'
import Yargs from 'yargs'

import { commandDev } from './command-dev'
import { commandGenTypes } from './command-gen-types'
import { reporter } from './reporter'

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
        reporter.setVerbose(!!argv.verbose)
        let projectRoot = Path.resolve(cwd, argv.app)
        commandDev({ projectRoot })
      },
    )
    .command(
      'gen-types [app]',
      'Generate a types.json for the public API (internal, useful for testing)',
      _ => _,
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        const projectRoot = Path.resolve(cwd)
        const projectEntry = Path.join(
          projectRoot,
          // ts:main?
          (await readJSON(Path.join(projectRoot, 'package.json')))['ts:main'],
        )
        commandGenTypes({ projectRoot, projectEntry })
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
