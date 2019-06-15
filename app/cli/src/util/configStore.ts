import { isDefined } from '@o/utils'
import ConfigStore from 'configstore'
import { join } from 'path'
import prompts from 'prompts'

import { reporter } from '../reporter'

const conf = new ConfigStore(`orbit`, {}, { globalConfigPath: true })

/** { [fullpath]: info } */
type AppBuildInfo = {
  [key: string]: {
    buildId: number
  }
}

export const baseWorkspaceDir = join(conf.path, '..', 'base-orbit-workspace')

export const configStore = {
  packageManager: createConfig<string>('packageManager'),
  orbitMainPath: createConfig<string>('orbitMainPath'),
  appBuildInfo: createConfig<AppBuildInfo>('appBuildInfo'),
  lastActiveWorkspace: createConfig<string>('lastActiveWorkspace2', baseWorkspaceDir),
}

export const promptPackageManager = async () => {
  const promptsAnswer = await prompts([
    {
      type: `select`,
      name: `package_manager`,
      message: `Which package manager would you like to use ?`,
      choices: [{ title: `yarn`, value: `yarn` }, { title: `npm`, value: `npm` }],
      initial: 0,
    },
  ])
  const response = promptsAnswer.package_manager
  if (response) {
    configStore.packageManager.set(response)
  }
  return response
}

function createConfig<A extends any>(key: string, defaultValue?: A) {
  if (isDefined(defaultValue) && !isDefined(conf.get(key))) {
    conf.set(key, defaultValue)
  }
  return {
    get: (): A => conf.get(key),
    set: (val: A) => {
      conf.set(key, val)
      reporter.info(`configStore.set ${key} ${JSON.stringify(val)}`)
    },
  }
}
