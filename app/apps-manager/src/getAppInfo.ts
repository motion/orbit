import { Logger } from '@o/logger'
import { AppDefinition } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'

const log = new Logger('getAppInfo')

export async function getAppInfo(appRoot: string): Promise<AppDefinition | null> {
  try {
    const path = join(appRoot, 'dist', 'appInfo.json')
    log.debug(`getAppInfo ${path}`)
    const appDef = await readJSON(path)
    if (!appDef) {
      throw new Error(`No appInfo export default found`)
    }
    return appDef
  } catch (err) {
    if (err.message.includes(`no such file or directory`)) {
      return null
    }
    log.error(err.message, err)
    return null
  }
}
