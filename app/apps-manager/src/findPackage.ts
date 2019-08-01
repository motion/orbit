import { join } from 'path'

import { pathExistsSync, readFileSync } from 'fs-extra'
import { Logger } from '@o/logger'
import { isOrbitApp } from '@o/libs-node'

const log = new Logger('findPackage')

/**
 * Finds a package root directory (where package.json is) given id and current directory
 * Traverses upwards as necessary to find node_modules.
 *
 * Also supports workspace style apps that are directly in current directory.
 */
export function findPackage({ packageId, directory }: { packageId: string; directory: string }) {
  // check if current directory is an orbit app already with packageId
  try {
    if (pathExistsSync(join(directory, 'package.json')) && isOrbitApp(directory)) {
      const pkgInfo = JSON.parse(readFileSync(join(directory, 'package.json')).toString())
      if (pkgInfo.name === packageId) {
        return directory
      }
    }
  } catch (err) {
    console.log('err', err)
  }

  let cur = directory
  let path = ''
  let iter = 0
  while (!path && cur.length > 2 && iter < 100) {
    iter++
    try {
      const nextPath = join(cur, 'node_modules', packageId)
      log.verbose(`checking path ${nextPath}`)
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
