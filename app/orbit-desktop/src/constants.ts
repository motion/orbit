import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'

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
