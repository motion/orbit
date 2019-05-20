import { buildApp } from '@o/build-server'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from './reporter'

export async function commandBuild(options: { projectRoot: string }) {
  try {
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    if (!pkg) {
      console.error('No package found!')
      return null
    }
    const main = pkg['ts:main'] || pkg.main
    if (!main || !(await pathExists(main))) {
      console.error(`No main entry found at ${main}`)
      return null
    }

    // build node
    console.log('Building node app...')
    await buildApp({
      projectRoot: options.projectRoot,
      entry: main,
      target: 'node',
      outputFile: 'index.node.js',
    })

    // build web
    console.log('Building web app...')
  } catch (err) {
    reporter.error(err.message, err)
  }
}