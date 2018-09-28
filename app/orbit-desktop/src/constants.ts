import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'

// we re-route this with electron-builder to here
export const oracleBinPath =
  Config.isProd && Path.join(Config.paths.resources, '..', 'MacOS', 'oracle')

export const DATABASE_PATH = Path.join(Config.paths.userData, `${env}_database.sqlite`)

export const oracleOptions = {
  binPath: oracleBinPath,
  socketPort: Config.ports.oracleBridge,
}

export const COSAL_DB = Path.join(Config.paths.userData, 'cosal.json')
