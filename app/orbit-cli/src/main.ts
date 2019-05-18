#!/usr/bin/env node
import './processDispose'

import { readJSON } from 'fs-extra'
import * as Path from 'path'
import Yargs from 'yargs'

import { commandBuild } from './command-build'
import { commandDev } from './command-dev'
import { commandGenTypes } from './command-gen-types'
import { commandWs } from './command-ws'
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
      'build [app]',
      'Builds an app for deployment',
      p =>
        p.positional('app', {
          type: 'string',
          default: '.',
          describe: 'The application to run',
        }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        let projectRoot = Path.resolve(cwd, argv.app)
        commandBuild({ projectRoot })
      },
    )
    .command(
      'ws [workspace]',
      'Run an Orbit workspace',
      p =>
        p.positional('workspace', {
          type: 'string',
          default: '.',
          describe: 'The application to run',
        }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        let workspaceRoot = Path.resolve(cwd, argv.workspace)
        commandWs({ workspaceRoot })
      },
    )
    .command(
      'gen-types [app]',
      'Generate a types.json for the public API (internal, useful for testing)',
      p => p.option('out', { alias: 'o' }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        const projectRoot = Path.resolve(cwd)
        const projectEntry = Path.join(
          projectRoot,
          // ts:main?
          (await readJSON(Path.join(projectRoot, 'package.json')))['ts:main'],
        )
        commandGenTypes({
          projectRoot,
          projectEntry,
          out: argv.out ? `${argv.out}` : undefined,
        })
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
