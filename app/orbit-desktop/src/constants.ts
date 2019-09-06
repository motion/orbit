import { getGlobalConfig } from '@o/config'
import * as Path from 'path'
import electronUtil from 'electron-util/node'
import { join } from 'path'

export const ROOT_DESKTOP_PATH = electronUtil.fixPathForAsarUnpack(join(__dirname, '..'))

const Config = getGlobalConfig()
const isDevelopment = process.env.NODE_ENV === 'development'

// we re-route this with electron-builder to here
export const screenBinPath =
  Config.isProd && Path.join(Config.paths.resources, '..', 'MacOS', 'screen')

export const DATABASE_PATH = Path.join(
  Config.paths.userData,
  isDevelopment ? `development_database.sqlite` : `orbit_database.sqlite`,
)

export const screenOptions = {
  binPath: screenBinPath,
  socketPort: Config.ports.screenBridge,
}

export const COSAL_DB = Path.join(Config.paths.userData, 'cosal.json')
