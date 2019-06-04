import { join } from 'path'

export function findPackage(packageId: string, directory: string) {
  let cur = directory
  let path = ''
  let iter = 0
  while (!path && path.length > 2 && iter < 100) {
    iter++
    try {
      path = require.resolve(join(cur, 'node_modules', packageId))
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
