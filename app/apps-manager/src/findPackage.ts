import { isOrbitApp } from '@o/libs-node'
import { Logger } from '@o/logger'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

const log = new Logger('findPackage')

/**
 * Finds a package root directory (where package.json is) given id and current directory
 * Traverses upwards as necessary to find node_modules.
 *
 * Returns the string directory of the app
 *
 * Also supports workspace style apps that are directly in current directory.
 * BECAUSE they are hardlinked into node_modules... we may need to od that better
 */
export async function findPackage({
  packageId,
  directory,
}: {
  packageId: string
  directory: string
}) {
  // check if current directory is an orbit app already with packageId
  const pkgPath = join(directory, 'package.json')
  try {
    if ((await pathExists(pkgPath)) && (await isOrbitApp(directory))) {
      const pkgInfo = await readJSON(pkgPath)
      if (pkgInfo.name === packageId) {
        return directory
      }
    }
  } catch (err) {
    log.error(`Error parsing package.json at ${pkgPath} ${err.message} ${err.stack}`, err)
  }

  let cur = directory
  let path = ''
  let iter = 0
  while (!path && cur.length > 2 && iter < 100) {
    iter++
    try {
      const nextPath = join(cur, 'node_modules', packageId)
      log.debug(`checking path ${nextPath}`)
      path = require.resolve(nextPath)
      // found "compiled out" path so lets make sure we go up to name
      const baseName = packageId.replace(/@[a-zA-Z0-9_\-\.]+\//, '') // remove any namespace
      const packageRootIndex = path.split('/').findIndex(x => x === baseName) // find root index
      const packageRoot = path
        .split('/')
        .slice(0, packageRootIndex + 1)
        .join('/')
      path = packageRoot
    } catch {
      cur = join(cur, '..')
    }
  }
  return path
}
