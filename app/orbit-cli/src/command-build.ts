import { buildApp } from '@o/build-server'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from './reporter'

export async function commandBuild(options: { projectRoot: string; watch?: boolean }) {
  try {
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    if (!pkg) {
      console.error('No package found!')
      return null
    }

    const main = join(options.projectRoot, pkg['ts:main'] || pkg.main)

    if (!main || !(await pathExists(main))) {
      console.error(`No main entry found at ${main}`)
      return null
    }

    // build node
    await buildApp({
      name: pkg.name,
      context: options.projectRoot,
      entry: [main],
      target: 'node',
      outputFile: 'index.node.js',
      watch: options.watch,
    })

    // build web
  } catch (err) {
    reporter.error(err.message, err)
  }
}
