import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { setIdentifierToPackageId } from './getPackageId'
import { getWorkspaceAppPaths } from './getWorkspaceAppPaths'

/**
 * Given a workspace, finds all packages, then updates our local cache of identifier => packageId
 */
export async function updateWorkspacePackageIds(workspaceRoot: string) {
  const paths = await getWorkspaceAppPaths(workspaceRoot)
  reporter.info(
    `Updating workspace package ids: ${workspaceRoot}, got ${paths
      .map(x => x.packageId)
      .join(', ')}`,
  )
  for (const { packageId, directory } of paths) {
    const buildInfoPath = join(directory, 'dist', 'buildInfo.json')
    if (await pathExists(buildInfoPath)) {
      const buildInfo = await readJSON(buildInfoPath)
      if (buildInfo.identifier) {
        setIdentifierToPackageId(buildInfo.identifier, packageId)
      } else {
        reporter.info(`No identifier in buildInfo.json ${JSON.stringify(buildInfo)}`)
      }
    } else {
      reporter.info(`No buildInfo.json found: ${buildInfoPath}`)
    }
  }
}
