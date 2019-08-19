import { Logger } from '@o/logger'
import { AppDefinition } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'

const log = new Logger('loadAppEntry')

const entryFileNames = {
  node: 'index.node.js',
  web: 'index.js',
}

export async function loadAppEntry(
  directory: string,
  entryType: 'node' | 'web',
): Promise<AppDefinition | null> {
  try {
    const path = join(directory, 'dist', entryFileNames[entryType])
    log.verbose(`path for ${entryType}: ${path}`)
    if (await pathExists(path)) {
      return require(path).default
    }
  } catch (err) {
    log.error(`Error loading entry`, err)
    return null
  }
}
