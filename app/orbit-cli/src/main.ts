#!/usr/bin/env node

import chalk from 'chalk'
import coolTrim from 'cool-trim'
import { get, mapValues, omit, pick } from 'lodash'
import minimist from 'minimist'
import stripAnsi from 'strip-ansi'
import manifest from '../package.json'
import { getOrbit } from './getOrbit.js'
import { OrbitCLI } from './OrbitCLI.js'

const ORBIT_ARGS = ['directory', 'configFilePath', 'configLoadFile']
const OMIT_ARGS = ORBIT_ARGS.concat(['_', 'dev', 'watch', 'debug'])

const argv = mapValues(
  minimist(process.argv.slice(2), {
    string: ['configFilePath', 'directory'],
    boolean: ['configLoadFile'],
    default: {
      dev: {},
      watch: {},
      configLoadFile: true,
    },
  }),
  value => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  },
)

const orbitArgs = pick(argv, ORBIT_ARGS)
const orbitConfig = omit(argv, OMIT_ARGS)

function log(contents: string): void {
  console.log(chalk.supportsColor ? contents : stripAnsi(contents))
}

let orbit: OrbitCLI

async function main() {
  if (argv.v || argv.version) {
    console.log(`Orbit v${manifest.version} - Build Amazing Apps Together`)
    process.exit(0)
  }
  if (argv.help || argv.h) {
    log(coolTrim`
    Usage: orbit [...options]

    These are the common top level options:
      < no parameter >            Compile the contents of a project and write to output directory
      --watch                     Just like compile but watches and recompiles on changes
      --dev                       Compile the contents and start an http server on a port (3000 by default)
                                  but do not write to output directory
      --directory <path>          Start Orbit in a specific directory (supports other options)
      --debug                     Shows detailed error information
      --version                   Print the version of the program
      --help                      Show this help text

    Here are some of Orbit's config parameters (but others/all supported by Orbit can be used in dot notation):
      --directory                 Start orbit in a specific directory (is process.cwd() by default)
      --dev.port                  TCP port to listen for dev server connections on (3000 by default)
      --dev.host                  Hostname/IP to listen for dev server connections on (localhost by default)

    Environment variables Orbit responds to:
      NODE_ENV                    Tells Orbit to use debug/production behavior
      ORBIT_DEBUG=1              Prints detailed stack traces to console (set by --debug opt)
    `)
    process.exit(1)
  }

  if (argv.debug) {
    process.env.ORBIT_DEBUG = '1'
  }

  orbit = await getOrbit({
    ...orbitArgs,
    config: orbitConfig,
  })

  const isDev = argv.dev === true || Object.keys(argv.dev).length > 0
  const isWatch = argv.watch === true || Object.keys(argv.watch).length > 0

  try {
    await orbit.initialize()

    if (!isWatch) {
      const result = await orbit.build({
        isDev,
      })
      orbit.dispose()
      console.log('done', result)
      return
    } else {
      if (isWatch) {
        const devPort = parseInt(get(argv, 'dev.port', 0), 10) || 3000
        const devHost = get(argv, 'dev.host', '127.0.0.1')
        console.log('Starting orbit on', devHost, devPort)
        await orbit.watch({
          devPort,
          devHost,
        })
      }
    }
  } catch (error) {
    console.error(error)
    orbit.dispose()
  }
}

main().catch(error => {
  if (orbit) {
    orbit.dispose()
  }
  console.error(error)
})
