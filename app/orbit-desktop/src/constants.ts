import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import { Cosal } from '@mcro/cosal'

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

// TODO make this just dependency inject
export const cosal = new Cosal()
