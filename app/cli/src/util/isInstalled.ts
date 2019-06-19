import { readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { findPackage } from './findPackage'

/**
 * Optionally pass a version to validate the version is installed
 */
export async function isInstalled(packageId: string, directory: string, version?: string) {
  try {
    const pkg = await readJSON(join(directory, 'package.json'))
    reporter.info(
      `isInstalled -- checking ${packageId} in ${directory} at version ${version || 'any'}`,
    )
    if (!pkg.dependencies[packageId]) {
      return false
    }

    if (version) {
      const packagePath = findPackage({ packageId, directory })
      reporter.info(`isInstalled -- checking package.json exists at ${packagePath}`)
      if (!packagePath) {
        return false
      }
      const packageInfo = await readJSON(join(packagePath, 'package.json'))
      reporter.info(`Got packageInfo ${packagePath} ${packageInfo.version}`)
      return packageInfo.version === version
    } else {
      return true
    }
  } catch (err) {
    reporter.error(err.message, err)
    return false
  }
}
