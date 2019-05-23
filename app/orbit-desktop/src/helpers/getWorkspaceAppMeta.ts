import { Logger } from '@o/kit'
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

  log.info('found packages', packages)
  let parentDir = join(spaceDir)
  let nodeModuleDir = ''

  // find parent node_modules
  while (parentDir.length > 1) {
    nodeModuleDir = join(parentDir, 'node_modules')
    if (await pathExists(nodeModuleDir)) {
      break
    }
    parentDir = join(parentDir, '..')
  }

  console.log('nodeModuleDir', nodeModuleDir)

  if (!(await pathExists(nodeModuleDir))) {
    log.info('Error no node_modules directory found')
    return null
  }

  return await Promise.all(
    Object.keys(packages).map(async packageId => {
      const directory = join(nodeModuleDir, ...packageId.split('/'))
      const packageJsonPath = join(directory, 'package.json')
      let packageJson = null
      if (!(await pathExists(packageJsonPath))) {
        log.error(`No package.json for app ${packageId}`)
      } else {
        packageJson = await readJSON(packageJsonPath)
      }
      const apiInfoPath = join(directory, 'api.json')
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
  )
}
