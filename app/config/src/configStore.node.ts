import { Logger } from '@o/logger'
import { isDefined } from '@o/utils'
import ConfigStore from 'configstore'
import { join } from 'path'

const log = new Logger('configStore')
const conf = new ConfigStore(`orbit`, {}, { globalConfigPath: true })

export const baseWorkspaceDir = join(conf.path, '..', 'base-orbit-workspace')

/**
 * This is persisted config to the disk
 */
export const configStore = {
  packageManager: createConfig<string>('packageManager'),
  lastActiveWorkspace: createConfig<string>('lastActiveWorkspace2', baseWorkspaceDir),
}

function createConfig<A extends any>(key: string, defaultValue?: A) {
  if (isDefined(defaultValue) && !isDefined(conf.get(key))) {
    conf.set(key, defaultValue)
  }
  return {
    get: (): A => conf.get(key),
    set: (val: A) => {
      conf.set(key, val)
      log.info(`.set ${key} ${JSON.stringify(val)}`)
    },
  }
}
