import { getAppInfo } from '@o/apps-manager'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { getBuildInfo, log, readBuildInfo } from './commandBuild'

export async function shouldRebuildApp(appRoot: string) {
  try {
    // do some basic sanity checks
    // no buildInfo yet
    if (!(await isValidJSONFile(join(appRoot, 'dist', 'buildInfo.json')))) {
      throw new ShouldRebuildMissingBuildInfo()
    }
    // no appInfo yet
    if (!(await isValidJSONFile(join(appRoot, 'dist', 'appInfo.json')))) {
      throw new ShouldRebuildMissingAppInfo()
    }
    // do some appInfo => output comparison checks
    const appInfo = await getAppInfo(appRoot)
    // ensure api file built
    if (appInfo.api && !(await isValidJSONFile(join(appRoot, 'dist', 'api.json')))) {
      throw new ShouldRebuildMissingApi()
    }
    // ensure node bundle built
    if (appInfo.workers || appInfo.graph) {
      if (!(await pathExists(join(appRoot, 'dist', 'index.node.js')))) {
        throw new ShouldRebuildMissingNodeApp()
      }
    }
    // ensure buildInfo hash is equal
    const current = await getBuildInfo(appRoot)
    const existing = await readBuildInfo(appRoot)
    if (JSON.stringify(current) !== JSON.stringify(existing)) {
      log.info(
        `changed,\n${JSON.stringify(current, null, 2)}\nvs\n${JSON.stringify(existing, null, 2)}`,
      )
      throw new ShouldRebuildNewBuildInfo()
    }
    // good
    return false
  } catch (err) {
    log.verbose(`shouldRebuild! ${err.constructor.name}`)
    return true
  }
}
async function isValidJSONFile(path: string) {
  try {
    await readJSON(path)
    return true
  } catch (err) {
    log.info(`Error reading json ${err.message}`)
    return false
  }
}

class ShouldRebuildMissingBuildInfo {}
class ShouldRebuildMissingAppInfo {}
class ShouldRebuildMissingApi {}
class ShouldRebuildMissingNodeApp {}
class ShouldRebuildNewBuildInfo {}
