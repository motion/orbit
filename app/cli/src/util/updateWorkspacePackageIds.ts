import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { identifierToPackageId } from './getPackageId'
import { getWorkspaceAppPaths } from './getWorkspaceAppPaths'

/**
 * Given a workspace, finds all packages, then updates our local cache of identifier => packageId
 */
export async function updateWorkspacePackageIds(workspaceRoot: string) {
  reporter.info(`Updating workspace package ids: ${workspaceRoot}`)
  const paths = await getWorkspaceAppPaths(workspaceRoot)
  for (const { packageId, directory } of paths) {
    const buildInfoPath = join(directory, 'dist', 'buildInfo.json')
    if (await pathExists(buildInfoPath)) {
      const buildInfo = await readJSON(buildInfoPath)
      if (buildInfo.identifier) {
        identifierToPackageId[buildInfo.identifier] = packageId
      }
    }
  }
}
