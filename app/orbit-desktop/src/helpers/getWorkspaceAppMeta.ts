import { Logger } from '@o/logger'
import { AppMeta, Space } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

const log = new Logger('getWorkspaceAppMeta')

export async function getWorkspaceAppMeta(space: Space): Promise<AppMeta[]> {
  if (!space) {
    log.info('no space given!')
    return null
  }
  const spaceDir = space.directory
  log.info('read space directory', spaceDir)
  const pkg = await readJSON(join(spaceDir, 'package.json'))
  if (!pkg) {
    log.error('No package found!')
    return null
  }
  const packages = pkg.dependencies
  if (!packages) {
    log.error('No app definitions in package.json')
    return null
  }

  log.info('found packages', Object.keys(packages).join(', '))

  const response = await Promise.all(
    Object.keys(packages).map(async packageId => {
      try {
        const directory = await findNodeModuleDir(spaceDir, packageId)
        const packageJsonPath = join(directory, 'package.json')
        let packageJson = null
        if (!(await pathExists(packageJsonPath))) {
          log.error(`No package.json for app ${packageId}`)
        } else {
          packageJson = await readJSON(packageJsonPath)
        }
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
      } catch (err) {
        log.error(`Error loading appMeta`, err.message, err.stack)
        return null
      }
    }),
  )

  return response.filter(Boolean)
}

// TODO this fn shared by cli

async function findNodeModuleDir(startDir: string, packageName: string) {
  let modulesDir = join(startDir, 'node_modules')
  // find parent node_modules
  while (modulesDir !== '/') {
    modulesDir = join(modulesDir, '..', '..', 'node_modules')
    const moduleDir = join(modulesDir, ...packageName.split('/'))
    if (await pathExists(moduleDir)) {
      return moduleDir
    }
  }
  return null
}
