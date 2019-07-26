import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

export async function readPackageJson(appRoot: string) {
  const packagePath = join(appRoot, 'package.json')
  if (!(await pathExists(packagePath))) {
    return null
  }
  return await readJSON(packagePath)
}
