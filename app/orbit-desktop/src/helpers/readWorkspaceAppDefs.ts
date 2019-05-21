import { AppDefinition, Logger } from '@o/kit'
import { Space } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

type AppDefinitions = { [id: string]: AppDefinition }

const log = new Logger('readWorkspaceAppDefs')

export async function readWorkspaceAppDefs(space: Space): Promise<AppDefinitions | null> {
  if (!space) {
    log.info('no space given!')
    return {}
  }
  const directory = space.directory
  log.info('read space directory', directory)
  const pkg = await readJSON(join(directory, 'package.json'))
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
  let nodeModuleDir = join(directory, 'node_modules')

  // find parent node_modules
  while (!(await pathExists(nodeModuleDir)) && nodeModuleDir !== '/') {
    nodeModuleDir = join(nodeModuleDir, '..', '..', 'node_modules')
  }

  if (!(await pathExists(nodeModuleDir))) {
    log.info('Error no node_modules directory found')
    return {}
  }

  const definitions: AppDefinitions = {}

  await Promise.all(
    Object.keys(packages).map(async id => {
      const pkgPath = join(nodeModuleDir, ...id.split('/'))

      if (await pathExists(pkgPath)) {
        try {
          const nodeEntryPath = join(pkgPath, 'dist', 'index.node.js')
          log.info(`Importing entry ${nodeEntryPath}`)
          const nodeEntry = require(nodeEntryPath)
          if (!nodeEntry || !nodeEntry.default) {
            log.info(`App must \`export default\` an AppDefinition, got ${typeof nodeEntry}`)
            return
          }
          log.info('got an app def', id, !!nodeEntry.default)
          definitions[id] = nodeEntry.default
        } catch (err) {
          log.error(`Error finding package definition: ${id}, message: ${err.message}`)
          log.error(err.stack)
        }
      } else {
        log.error('Module not installed', id)
      }
    }),
  )

  return definitions
}
