import * as Path from 'path'
import { pathExists, writeJSON, remove } from 'fs-extra'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()

export const name = 'ensure config'

const configPath = Path.join(Config.paths.userData, 'orbit.json')

export async function condition() {
  return await pathExists(configPath)
}

export async function run() {
  // 1. ensure a config file
  const config = Config
  await writeJSON(configPath, config)

  // 2. remove old db
  const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'
  await remove(Path.join(Config.paths.userData, `${env}_database.sqlite`))
}
