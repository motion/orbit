import { reporter } from '../reporter'
import { setIdentifierToPackageId } from './getPackageId'
import { getWorkspaceApps } from './getWorkspaceApps'
import { getBuildInfo } from '../command-build'

/**
 * Given a workspace, finds all packages, then updates our local cache of identifier => packageId
 */
export async function updateWorkspacePackageIds(workspaceRoot: string) {
  const paths = await getWorkspaceApps(workspaceRoot)
  reporter.info(
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
        reporter.info(`No identifier in buildInfo.json ${JSON.stringify(buildInfo)}`)
      }
    } else {
      reporter.info(`No buildInfo.json found: ${directory}`)
    }
  }
}
