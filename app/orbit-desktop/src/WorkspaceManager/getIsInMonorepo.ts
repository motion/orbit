import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

export async function getIsInMonorepo(curDirectory: string) {
  const monorepoPkg = join(curDirectory, '..', '..', '..', '..', 'package.json')
  const res =
    (await pathExists(monorepoPkg)) && (await readJSON(monorepoPkg)).name === 'orbit-monorepo'
  console.log('\n\nwe need to fix this function post-refactor getIsInMonorepo', monorepoPkg, res)
  return res
}
