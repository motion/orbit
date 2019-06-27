import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { findPackage } from './findPackage'

/**
 * Finds all valid orbit app package directories in a given workspace
 */
export async function getWorkspaceAppPaths(workspacePath: string) {
  const packageJson = join(workspacePath, 'package.json')
  const packages = (await readJSON(packageJson)).dependencies
  return (await Promise.all(
    Object.keys(packages).map(async packageId => {
      const directory = findPackage({ directory: workspacePath, packageId })
      if (!directory) {
        reporter.error(`No directory found for package ${workspacePath} ${packageId}`)
        return null
      }
      const apiInfoPath = join(directory, 'dist', 'api.json')
      let apiInfo = null
      if (await pathExists(apiInfoPath)) {
        apiInfo = await readJSON(apiInfoPath)
      }
      return {
        packageId,
        packageJson,
        directory,
        apiInfo,
      }
    }),
  )).filter(Boolean)
}
