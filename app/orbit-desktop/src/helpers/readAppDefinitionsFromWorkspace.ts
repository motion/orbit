import { AppDefinition } from '@o/kit'
import { Space } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

type AppDefinitions = { [id: string]: AppDefinition }

export async function readAppDefinitionsFromWorkspace(
  space: Space,
): Promise<AppDefinitions | null> {
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

  const nodeModuleDir = join(directory, 'node_modules')

  const definitions: AppDefinitions = {}

  await Promise.all(
    Object.keys(packages).map(async id => {
      const pkgPath = join(nodeModuleDir, ...id.split('/'))
      if (await pathExists(pkgPath)) {
        try {
          const pkgEntry = (await readJSON(join(pkgPath, 'package.json'))).main
          if (!pkgEntry) {
            console.log('No package "main" found in package.json')
            return
          }
          const entry = require(pkgEntry)
          if (!entry || !entry.default) {
            console.log('App must `export default` an AppDefinition')
            return
          }
          console.log('got an app def', entry.default)
          definitions[id] = entry.default
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
