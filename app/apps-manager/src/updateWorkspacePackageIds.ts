import { Logger } from '@o/logger'

import { getAppInfo } from './getAppInfo'
import { setIdentifierToPackageId } from './getPackageId'
import { getWorkspaceApps } from './getWorkspaceApps'

const log = new Logger('updateWorkspacePackageIds')

/**
 * Given a workspace, finds all packages, then updates our local cache of identifier => packageId
 */
export async function updateWorkspacePackageIds(workspaceRoot: string) {
  const paths = await getWorkspaceApps(workspaceRoot)
  log.verbose(
    `Updating workspace package ids: ${workspaceRoot}, got ${paths
      .map(x => x.packageId)
      .join(', ')}`,
  )
  await Promise.all(
    paths.map(async ({ packageId, directory }) => {
      const appInfo = await getAppInfo(directory)
      log.debug(`got ${packageId} ${JSON.stringify(appInfo)}`)
      if (appInfo) {
        if (appInfo.id) {
          setIdentifierToPackageId(appInfo.id, packageId)
        } else {
          log.info(`No identifier in appInfo ${JSON.stringify(appInfo)}`)
        }
      } else {
        log.info(`No appInfo found: ${directory}`)
      }
    }),
  )
}
