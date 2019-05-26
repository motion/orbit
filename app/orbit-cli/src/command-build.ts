import { buildApp } from '@o/build-server'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { commandGenTypes } from './command-gen-types'
import { reporter } from './reporter'

type CommandBuildOptions = { projectRoot: string; watch?: boolean }

export async function commandBuild(options: CommandBuildOptions) {
  try {
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    if (!pkg) {
      console.error('No package found!')
      return null
    }

    const entry = join(options.projectRoot, pkg['ts:main'] || pkg.main)

    if (!entry || !(await pathExists(entry))) {
      console.error(`No main entry found at ${entry}`)
      return null
    }

    await Promise.all([
      // bundle app
      bundleApp(entry, pkg, options),
      // generate api types
      commandGenTypes({
        projectRoot: options.projectRoot,
        projectEntry: entry,
        out: join(options.projectRoot, 'dist', 'api.json'),
      }),
    ])

    // build web
  } catch (err) {
    reporter.error(err.message, err)
  }
}

async function bundleApp(entry: string, pkg: any, options: CommandBuildOptions) {
  // build node
  await buildApp({
    name: pkg.name,
    context: options.projectRoot,
    entry: [entry],
    target: 'node',
    outputFile: 'index.node.js',
    watch: options.watch,
  })
}
