import * as Path from 'path'
import { pathExists, writeJSON, remove } from 'fs-extra'
import { getGlobalConfig } from '@mcro/config'
import { writeOrbitConfig } from '../../../helpers'

const Config = getGlobalConfig()

export const ensureConfig = {
  condition: () => pathExists(Config.paths.orbitConfig),
  async run() {
    // 1. ensure a config file
    await writeOrbitConfig()

    // 2. remove old db
    const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'
    await remove(Path.join(Config.paths.userData, `${env}_database.sqlite`))
  },
}
