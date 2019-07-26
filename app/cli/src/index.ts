#!/usr/bin/env node
import {
  CommandBuildOptions,
  CommandDevOptions,
  CommandGenTypesOptions,
  CommandInstallOptions,
  CommandWsOptions,
  StatusReply,
} from '@o/models'
import { readJSON } from 'fs-extra'
import { join, resolve } from 'path'
import Yargs from 'yargs'

import { CommandNewOptions } from './command-new'
import { CommandPublishOptions } from './command-publish'
import { reporter } from './reporter'

// these require inside fn because we want to avoid long startup time requiring everything

export const commandWs = (x: CommandWsOptions) => require('./command-ws').commandWs(x)
export const commandDev = (x: CommandDevOptions) => require('./command-dev').commandDev(x)
export const commandBuild = (x: CommandBuildOptions) => require('./command-build').commandBuild(x)
export const commandPublish = (x: CommandPublishOptions) =>
  require('./command-publish').commandPublish(x)
export const commandNew = (x: CommandNewOptions) => require('./command-new').commandNew(x)
export const commandGenTypes = (x: CommandGenTypesOptions) =>
  require('./command-gen-types').commandGenTypes(x)
export const commandInstall = (x: CommandInstallOptions): StatusReply =>
  require('./command-install').commandInstall(x)

// using require here because it's outside of ts's rootDir and ts complains otherwise
const packageJson = require('../package.json')

let cwd = process.cwd()
let version = packageJson.version
let description = `Orbit v${version} - Build Amazing Apps Together`

const setVerbose = (logLevel?: number) => {
  process.env.LOG_LEVEL = `${logLevel || 0}`
  if (logLevel > 0) {
    reporter.setVerbose(true)
  }
}

function main() {
  require('./processDispose')

  Yargs.scriptName('orbit')
    .usage('$0 <cmd> [args]')
    .option('logLevel', {
      type: 'number',
      default: 0,
    })
    .command(
      'new [appName] [template]',
      'Create a new orbit app',
      p =>
        p
          .positional('appName', {
            type: 'string',
            describe:
              'The name of the folder to create for your new app, no spaces / special characters.',
          })
          .positional('template', {
            type: 'string',
            describe:
              'Choose from pre-defined starter app templates, or give an identifier of an existing orbit app, or a shorthand to a github repository.',
            default: 'blank',
          }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let projectRoot = resolve(cwd, argv.appName)
        const res = await commandNew({
          projectRoot,
          name: argv.appName,
          template: argv.template,
        })
        if (res.type === 'error') {
          reporter.panic(res.message)
        }
      },
    )
    .command(
      'dev [appName]',
      'Run an Orbit app in development mode',
      p =>
        p.positional('appName', {
          type: 'string',
          default: '.',
          describe: 'The application to run',
        }),
      async argv => {
        setVerbose(argv.logLevel)
        let projectRoot = resolve(cwd, argv.appName)
        await commandDev({ projectRoot })
      },
    )
    .command(
      'install [id] [ws]',
      'Install app into workspace',
      p =>
        p
          .positional('id', {
            type: 'string',
            default: '.',
            describe: 'The application identifier to install',
          })
          .positional('ws', {
            type: 'string',
            default: '.',
            describe: 'The workspace name to install to',
          })
          .option('force-install', {
            type: 'boolean',
            default: false,
          })
          .option('upgrade', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let directory = resolve(cwd, argv.ws)
        await commandInstall({
          identifier: argv.id,
          directory,
          forceInstall: !!argv['force-install'],
          upgrade: !!argv.upgrade,
        })
      },
    )
    .command(
      'build [app]',
      'Builds an app for deployment',
      p =>
        p
          .positional('app', {
            type: 'string',
            default: '.',
            describe: 'The application to run',
          })
          .option('watch', {
            type: 'boolean',
            default: false,
          })
          .option('force', {
            type: 'boolean',
            default: false,
          })
          .option('debug-build', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let projectRoot = resolve(cwd, argv.app)
        await commandBuild({
          projectRoot,
          watch: !!argv.watch,
          force: !!argv.force,
          debugBuild: !!argv['debug-build'],
        })
      },
    )
    .command(
      'publish [app]',
      'Publish new version of app to registry',
      p =>
        p
          .positional('app', {
            type: 'string',
            default: '.',
            describe: 'The application to run',
          })
          .option('ignore-build', {
            type: 'boolean',
            default: false,
          })
          // .option('registry', {
          //   type: 'string',
          //   describe: `Publish to your own internal registry`,
          //   default: false,
          // })
          .option('ignore-version', {
            type: 'boolean',
            default: false,
          })
          .option('bump-version', {
            type: 'string',
            describe: 'One of: patch, minor, major',
          }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let projectRoot = resolve(cwd, argv.app)
        await commandPublish({
          projectRoot,
          ignoreBuild: !!argv['ignore-build'],
          ignoreVersion: !!argv['ignore-version'],
          bumpVersion: argv['bump-version'] as CommandPublishOptions['bumpVersion'],
        })
      },
    )
    .command(
      'ws [workspace]',
      'Run an Orbit workspace',
      p =>
        p
          .positional('workspace', {
            type: 'string',
            default: '.',
            describe: 'The application to run',
          })
          .option('clean', {
            type: 'boolean',
            default: false,
          })
          .option('mode', {
            type: 'string',
            default: 'development',
          }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let workspaceRoot = resolve(cwd, argv.workspace)
        await commandWs({
          workspaceRoot,
          clean: !!argv.clean,
          mode: argv.mode as any,
        })
      },
    )
    .command(
      'gen-types [app]',
      'Generate a types.json for the public API (internal, useful for testing)',
      p =>
        p
          .positional('app', {
            type: 'string',
            default: '.',
            describe: 'The application to run',
          })
          .option('out', { alias: 'o' }),
      async argv => {
        setVerbose(argv.logLevel)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        const projectRoot = resolve(cwd)
        const projectEntry = join(
          projectRoot,
          (await readJSON(join(projectRoot, 'package.json')))['main'],
        )
        await commandGenTypes({
          projectRoot,
          projectEntry,
          out: argv.out ? `${argv.out}` : undefined,
        })
      },
    )
    .version('version', 'Show version', description)
    .showHelpOnFail(true)
    .help().argv
}

// process.env._ is the bin path that ran this
// if were in a node environment it will be something like /usr/bin/node
// if were running from electron app something like /path/to/Orbit.app/electron
// if were running directly from the cli, like /usr/local/node_modules/orbit
// in the last case we want to run it immediately
const bin = process.env._

const cliName = 'orbit'
const isCli = bin.slice(bin.length - cliName.length) === cliName
if (isCli) {
  main()
}
