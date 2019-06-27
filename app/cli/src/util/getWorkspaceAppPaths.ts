import { pathExists, readJSON, readdir } from 'fs-extra'
import { join } from 'path'

import { reporter } from '../reporter'
import { findPackage } from './findPackage'
import { isOrbitApp } from '../command-build'

type OrbitAppDirDesc = {
  packageId: string
  directory: string
}

/**
 * Finds all valid orbit app package directories in a given workspace
 */
export async function getWorkspaceAppPaths(workspaceRoot: string) {
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
      return { directory, packageId }
    })
    const wsDirs = await getWorkspaceLocalPackageDirs(workspaceRoot)
    const allDirs = [...packageDirs, ...wsDirs]
    return (await Promise.all(
      allDirs.map(async ({ directory, packageId }) => {
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
      })
    }
  }
  reporter.info('getWorkspaceLocalPackageDirs', res)
  return res
}
