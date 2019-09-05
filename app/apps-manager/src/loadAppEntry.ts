import { Logger } from '@o/logger'
import { AppDefinition } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'

const log = new Logger('loadAppEntry()')

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
    log.verbose(`entryType ${entryType}: ${path}`)
    if (await pathExists(path)) {
      return require(path).default
    } else {
      log.info(`No entry found: ${path}`)
      return null
    }
  } catch (err) {
    log.error(`Error loading entry ${entryType}`, err.message, err.stack)
    return null
  }
}
