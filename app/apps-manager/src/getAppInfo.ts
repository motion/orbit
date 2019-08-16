import { Logger } from '@o/logger'
import { AppDefinition } from '@o/models'
import { join } from 'path'

const log = new Logger('getAppInfo')

export function getAppInfo(appRoot: string): AppDefinition | null {
  try {
    const path = join(appRoot, 'dist', 'appInfo.js')
    log.info(`getAppInfo ${path}`)
    const appDef = require(path).default
    if (!appDef) {
      throw new Error(`No appInfo export default found`)
    }
    return appDef
  } catch (err) {
    log.error(err.message, err)
    return null
  }
}
