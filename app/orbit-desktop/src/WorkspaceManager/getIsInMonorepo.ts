import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

export async function getIsInMonorepo() {
  const monorepoPkg = join(__dirname, '..', '..', '..', '..', 'package.json')
  const res =
    (await pathExists(monorepoPkg)) && (await readJSON(monorepoPkg)).name === 'orbit-monorepo'
  return res
}
