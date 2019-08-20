import { isOrbitApp } from '@o/libs-node'
import { Logger } from '@o/logger'
import { AppMeta, PackageJson } from '@o/models'
import { pathExists, readdir, readJSON } from 'fs-extra'
import { join } from 'path'

import { findPackage } from './findPackage'

const log = new Logger('getWorkspaceApps')

/**
 * Finds all valid orbit app package directories in a given workspace
 */
export async function getWorkspaceApps(workspaceRoot: string): Promise<AppMeta[]> {
  log.verbose(`workspaceRoot ${workspaceRoot}`)
  if (!workspaceRoot.trim()) {
    throw new Error(`No workspaceRoot given!`)
  }
  try {
    const packageJson: PackageJson = await readJSON(join(workspaceRoot, 'package.json'))
    const packageDirs: AppMeta[] = await Promise.all(
      Object.keys(packageJson.dependencies).map(async packageId => {
        const directory = await findPackage({ directory: workspaceRoot, packageId })
        if (!directory) {
          log.verbose(`No directory found for package ${workspaceRoot} ${packageId}`)
          return null
        }
        return await getAppMeta(directory, false)
      }),
    )
    const wsDirs = await getWorkspaceLocalAppsMeta(workspaceRoot)
    const res = [...packageDirs, ...wsDirs].filter(Boolean)
    log.verbose(`allDirs ${res.length}`, res)
    return res
  } catch (err) {
    log.error(`Error finding app paths`, err)
    return []
  }
}

async function getWorkspaceLocalAppsMeta(workspaceRoot: string): Promise<AppMeta[]> {
  const appsDir = join(workspaceRoot, 'apps')
  if (!(await pathExists(appsDir))) {
    return []
  }
  const directories = (await readdir(appsDir)).map(x => join(appsDir, x))
  return (await Promise.all(directories.map(dir => getAppMeta(dir, true)))).filter(Boolean)
}

export async function getAppMeta(directory: string, isLocal: boolean = false): Promise<AppMeta> {
  if (await isOrbitApp(directory)) {
    const packageJson = await readJSON(join(directory, 'package.json'))
    const packageId = packageJson.name
    const apiInfoPath = join(directory, 'dist', 'api.json')
    let apiInfo = null
    if (await pathExists(apiInfoPath)) {
      // could be empty...
      try {
        apiInfo = await readJSON(apiInfoPath)
      } catch (err) {
        log.info(`error reading api: ${err.message}`)
      }
    }
    return {
      packageJson,
      directory,
      packageId,
      apiInfo,
      isLocal,
    }
  } else {
    log.error(`Not an orbit app! ${directory}`)
    return null
  }
}
