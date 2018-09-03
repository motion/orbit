import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'

export const DATABASE_PATH = Path.join(
  Config.paths.userData,
  `${env}_database.sqlite`,
)
