#!/usr/bin/env node
import { readJSON } from 'fs-extra'
import { join, resolve } from 'path'

import { CommandBuildOptions } from './command-build'
import { CommandDevOptions } from './command-dev'
import { CommandGenTypesOptions } from './command-gen-types'
import { CommandInstallOptions, CommandInstallRes } from './command-install'
import { CommandNewOptions } from './command-new'
import { CommandPublishOptions } from './command-publish'
import { CommandWsOptions } from './command-ws'
import { reporter } from './reporter'

// programmatic API

export * from './util/downloadAppDefinition'
export * from './util/requireAppDefinition'
export * from './util/getPackageId'
export * from './util/findPackage'
export * from './util/getWorkspaceAppPaths'
export * from './util/updateWorkspacePackageIds'

// these require inside fn because we want to avoid long startup time requiring everything

export const commandWs = (x: CommandWsOptions) => require('./command-ws').commandWs(x)
export const commandDev = (x: CommandDevOptions) => require('./command-dev').commandDev(x)
export const commandBuild = (x: CommandBuildOptions) => require('./command-build').commandBuild(x)
export const commandPublish = (x: CommandPublishOptions) =>
  require('./command-publish').commandPublish(x)
export const commandNew = (x: CommandNewOptions) => require('./command-new').commandNew(x)
export const commandGenTypes = (x: CommandGenTypesOptions) =>
  require('./command-gen-types').commandGenTypes(x)
export const commandInstall = (x: CommandInstallOptions): CommandInstallRes =>
  require('./command-install').commandInstall(x)

// XXX(andreypopp): using require here because it's outside of ts's rootDir and
// ts complains otherwise
const packageJson = require('../package.json')

let cwd = process.cwd()
let version = packageJson.version
let description = `Orbit v${version} - Build Amazing Apps Together`

function main() {
  require('./processDispose')

  const Yargs = require('yargs')

  Yargs.scriptName('orbit')
    .usage('$0 <cmd> [args]')
    .command(
      'dev [app]',
      'Run an Orbit app in development mode',
      p =>
        p
          .positional('app', {
            type: 'string',
            default: '.',
            describe: 'The application to run',
          })
          .option('verbose', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        let projectRoot = resolve(cwd, argv.app)
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
          .option('verbose', {
            type: 'boolean',
            default: false,
          })
          .option('force-install', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let directory = resolve(cwd, argv.ws)
        await commandInstall({
          identifier: argv.id,
          directory,
          verbose: !!argv.verbose,
          forceInstall: !!argv['force-install'],
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
          })
          .option('verbose', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let projectRoot = resolve(cwd, argv.app)
        await commandBuild({
          projectRoot,
          watch: !!argv.watch,
          force: !!argv.force,
          verbose: !!argv.verbose,
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
          .option('verbose', {
            type: 'boolean',
            default: false,
          })
          .option('ignore-version', {
            type: 'boolean',
            default: false,
          })
          .option('bump-version', {
            type: 'string',
            describe: 'One of: patch, minor, major',
          }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
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
          .option('production', {
            type: 'boolean',
            default: false,
          }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        let workspaceRoot = resolve(cwd, argv.workspace)
        await commandWs({
          workspaceRoot,
          clean: !!argv.clean,
          mode: argv.production ? 'production' : 'development',
        })
      },
    )
    .command(
      'gen-types [app]',
      'Generate a types.json for the public API (internal, useful for testing)',
      p => p.option('out', { alias: 'o' }),
      async argv => {
        reporter.setVerbose(!!argv.verbose)
        reporter.info(`argv ${JSON.stringify(argv)}`)
        const projectRoot = resolve(cwd)
        const projectEntry = join(
          projectRoot,
          // ts:main?
          (await readJSON(join(projectRoot, 'package.json')))['ts:main'],
        )
        await commandGenTypes({
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
