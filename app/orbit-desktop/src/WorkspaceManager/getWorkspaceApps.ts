import { Logger } from '@o/logger'
import { AppMeta, PackageJson } from '@o/models'
import { pathExists, readdir, readJSON } from 'fs-extra'
import { join } from 'path'
import { findPackage } from './findPackage'
import { isOrbitApp } from './commandBuild'

const log = new Logger('getWorkspaceApps')

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
    log.info(`getWorkspaceApps ${workspaceRoot}`)
    console.trace('ok')
    const packageJson: PackageJson = await readJSON(join(workspaceRoot, 'package.json'))
    const packageDirs: OrbitAppDirDesc[] = Object.keys(packageJson.dependencies).map(packageId => {
      const directory = findPackage({ directory: workspaceRoot, packageId })
      if (!directory) {
        log.error(`No directory found for package ${workspaceRoot} ${packageId}`)
        return null
      }
      return { directory, packageId, isLocal: false }
    })
    const wsDirs = await getWorkspaceLocalPackageDirs(workspaceRoot)
    const allDirs = [...packageDirs, ...wsDirs].filter(Boolean)
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
    log.error(`Error finding app paths`, err)
  }
}

async function getWorkspaceLocalPackageDirs(workspaceRoot: string): Promise<OrbitAppDirDesc[]> {
  const appsDir = join(workspaceRoot, 'apps')
  const directories = (await readdir(appsDir)).map(x => join(appsDir, x))
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
  log.info(`getWorkspaceLocalPackageDirs ${JSON.stringify(res)}`)
  return res
}
