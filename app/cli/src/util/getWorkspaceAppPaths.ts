import { readJSON } from 'fs-extra'
import { join } from 'path'

import { findPackage } from './findPackage'

/**
 * Finds all valid orbit app package directories in a given workspace
 */
export async function getWorkspaceAppPaths(workspacePath: string) {
  const directory = join(require.resolve(workspacePath), '..')
  const packageJSON = join(directory, 'package.json')
  const packages = (await readJSON(packageJSON)).dependencies
  return Object.keys(packages).map(packageId => {
    return {
      packageId,
      directory: findPackage({ directory, packageId }),
    }
  })
}
