import { AppDefinition } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'

const entryFileNames = {
  node: 'index.node.js',
  web: 'index.js',
  appInfo: 'appInfo.js',
}

export async function loadAppEntry(
  directory: string,
  entryType: 'node' | 'web' | 'appInfo',
): Promise<AppDefinition | null> {
  try {
    const path = join(directory, 'dist', entryFileNames[entryType])
    reporter.info(`loadAppEntry type ${entryType} path ${path}`)
    if (await pathExists(path)) {
      return require(path).default
    }
  } catch (err) {
    reporter.error(`Error loading entry`, err)
    return null
  }
}
