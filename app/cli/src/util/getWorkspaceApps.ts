import { pathExists, readJSON, readdir } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { findPackage } from './findPackage'
import { isOrbitApp } from '../command-build'
import { AppMeta } from '@o/models'

type OrbitAppDirDesc = {
  packageId: string
  directory: string
  isLocal: boolean
}

/**
 * Finds all valid orbit app package directories in a given workspace
 */
export async function getWorkspaceApps(workspaceRoot: string): Promise<AppMeta[]> {
  try {
    reporter.info(`getWorkspaceAppPaths ${workspaceRoot}`)
    const packageJson = join(workspaceRoot, 'package.json')
    const packageDirs: OrbitAppDirDesc[] = Object.keys(
      (await readJSON(packageJson)).dependencies,
    ).map(packageId => {
      const directory = findPackage({ directory: workspaceRoot, packageId })
      if (!directory) {
        reporter.error(`No directory found for package ${workspaceRoot} ${packageId}`)
        return null
      }
      return { directory, packageId, isLocal: false }
    })
    const wsDirs = await getWorkspaceLocalPackageDirs(workspaceRoot)
    const allDirs = [...packageDirs, ...wsDirs]
    return (await Promise.all(
      allDirs.map(async ({ directory, packageId, isLocal }) => {
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
          isLocal,
        }
      }),
    )).filter(Boolean)
  } catch (err) {
    reporter.panic(`Error finding app paths`, err)
  }
}

async function getWorkspaceLocalPackageDirs(workspaceRoot: string): Promise<OrbitAppDirDesc[]> {
  const directories = await readdir(workspaceRoot)
  let res: OrbitAppDirDesc[] = []
  for (const directory of directories) {
    if (await isOrbitApp(directory)) {
      const packageId = (await readJSON(join(directory, 'package.json'))).name
      res.push({
        directory,
        packageId,
        isLocal: true,
      })
    }
  }
  reporter.info('getWorkspaceLocalPackageDirs', res)
  return res
}
