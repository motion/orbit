import { join } from 'path'
import { readJSON } from 'fs-extra'

export async function getDefaultVectors() {
  return await readJSON(join(__dirname, '..', 'vecs.data.json'))
}
