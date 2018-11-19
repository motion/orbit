import { readFileSync } from 'fs'
import { join } from 'path'

export function getDefaultVectors() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'vecs.json'), 'utf-8'))
}
