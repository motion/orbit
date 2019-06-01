import { isDefined } from '@o/utils'
import ConfigStore from 'configstore'
import prompts from 'prompts'

import { reporter } from '../reporter'

const conf = new ConfigStore(`orbit`, {}, { globalConfigPath: true })

type AppBuildInfo = {
  [key: string]: {
    buildId: number
  }
}

export const configStore = {
  packageManager: createConfig<string>('packageManager'),
  orbitMainPath: createConfig<string>('orbitMainPath'),
  /** { [fullpath]: info } */
  appBuildInfo: createConfig<AppBuildInfo>('appBuildInfo'),
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

function createConfig<A extends any>(key: string) {
  return {
    get: (): A => conf.get(key),
    set: (val: A) => {
      conf.set(key, val)
      reporter.info(`configStore.set ${key} ${JSON.stringify(val)}`)
    },
    getOrDefault: (val: A): A => {
      let cur = conf.get(key)
      if (!isDefined(cur)) {
        cur = val
        conf.set(key, val)
      }
      return cur
    },
  }
}
