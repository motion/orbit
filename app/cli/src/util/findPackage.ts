import { join } from 'path'

import { reporter } from '../reporter'

export function findPackage({ packageId, directory }: { packageId: string; directory: string }) {
  let cur = directory
  let path = ''
  let iter = 0
  while (!path && cur.length > 2 && iter < 100) {
    iter++
    try {
      const nextPath = join(cur, 'node_modules', packageId)
      reporter.info(`checking path ${nextPath}`)
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
