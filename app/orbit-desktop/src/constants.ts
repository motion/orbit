import { getGlobalConfig } from '@o/config'
import * as Path from 'path'

const Config = getGlobalConfig()
const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'

// we re-route this with electron-builder to here
export const screenBinPath =
  Config.isProd && Path.join(Config.paths.resources, '..', 'MacOS', 'screen')

export const DATABASE_PATH = Path.join(Config.paths.userData, `${env}_database.sqlite`)

export const screenOptions = {
  binPath: screenBinPath,
  socketPort: Config.ports.screenBridge,
}

export const COSAL_DB = Path.join(Config.paths.userData, 'cosal.json')
