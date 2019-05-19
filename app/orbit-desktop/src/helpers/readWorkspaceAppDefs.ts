import { AppDefinition } from '@o/kit'
import { Space } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

type AppDefinitions = { [id: string]: AppDefinition }

export async function readWorkspaceAppDefs(space: Space): Promise<AppDefinitions | null> {
  const directory = space.directory
  const pkg = await readJSON(join(directory, 'package.json'))
  if (!pkg) {
    console.error('No package found!')
    return null
  }
  const packages = pkg.dependencies
  if (!packages) {
    console.error('No app definitions in package.json')
    return null
  }

  let nodeModuleDir = join(directory, 'node_modules')

  // find parent node_modules
  while (!(await pathExists(nodeModuleDir)) && nodeModuleDir !== '/') {
    nodeModuleDir = join(nodeModuleDir, '..', '..', 'node_modules')
  }

  if (!(await pathExists(nodeModuleDir))) {
    console.log('Error no node_modules directory found')
    return {}
  }

  const definitions: AppDefinitions = {}

  await Promise.all(
    Object.keys(packages).map(async id => {
      const pkgPath = join(nodeModuleDir, ...id.split('/'))
      if (await pathExists(pkgPath)) {
        try {
          const nodeEntry = require(join(pkgPath, 'dist', 'index.node.js'))
          if (!nodeEntry || !nodeEntry.default) {
            console.log('App must `export default` an AppDefinition')
            return
          }
          console.log('got an app def', nodeEntry.default)
          definitions[id] = nodeEntry.default
        } catch (err) {
          console.log(`Error finding package definition: ${id}, message: ${err.message}`)
          console.log(err.stack)
        }
      } else {
        console.log('Module not installed', id)
      }
    }),
  )

  return definitions
}
