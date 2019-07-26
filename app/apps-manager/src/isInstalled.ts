import { Logger } from '@o/logger'

import { getWorkspaceApps } from './getWorkspaceApps'

const log = new Logger('isInstalled')

/**
 * Optionally pass a version to validate the version is installed
 */
export async function isInstalled(packageId: string, directory: string, version?: string) {
  try {
    log.info(`isInstalled -- checking ${packageId} in ${directory} at version ${version || 'any'}`)

    const apps = await getWorkspaceApps(directory)
    const foundApp = apps.find(x => x.packageId === packageId)

    if (!foundApp) {
      return false
    }

    // avoid managing versions of local apps
    if (foundApp.isLocal) {
      return true
    }

    if (version) {
      return foundApp.packageJson.version === version
    } else {
      return true
    }
  } catch (err) {
    log.error(err.message, err)
    return false
  }
}
