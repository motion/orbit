import { Logger } from '@o/logger'

import { getBuildInfo } from './buildInfo'
import { setIdentifierToPackageId } from './getPackageId'
import { getWorkspaceApps } from './getWorkspaceApps'

const log = new Logger('updateWorkspacePackageIds')

/**
 * Given a workspace, finds all packages, then updates our local cache of identifier => packageId
 */
export async function updateWorkspacePackageIds(workspaceRoot: string) {
  const paths = await getWorkspaceApps(workspaceRoot)
  log.info(
    `Updating workspace package ids: ${workspaceRoot}, got ${paths
      .map(x => x.packageId)
      .join(', ')}`,
  )
  for (const { packageId, directory } of paths) {
    const buildInfo = await getBuildInfo(directory)
    if (buildInfo) {
      if (buildInfo.identifier) {
        setIdentifierToPackageId(buildInfo.identifier, packageId)
      } else {
        log.info(`No identifier in buildInfo.json ${JSON.stringify(buildInfo)}`)
      }
    } else {
      log.info(`No buildInfo.json found: ${directory}`)
    }
  }
}
