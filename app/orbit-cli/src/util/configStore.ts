import Configstore from 'configstore'
import prompts from 'prompts'

import { reporter } from '../reporter'

let conf
try {
  conf = new Configstore(`orbit`, {}, { globalConfigPath: true })
} catch (e) {
  // This should never happen (?)
  conf = {
    settings: {
      'cli.packageManager': undefined,
    },
    get: key => conf.settings[key],
    set: (key, value) => (conf.settings[key] = value),
  }
}

const packageMangerConfigKey = `cli.packageManager`

export const getPackageManager = () => conf.get(packageMangerConfigKey)

export const setPackageManager = packageManager => {
  conf.set(packageMangerConfigKey, packageManager)
  reporter.info(`Preferred package manager set to "${packageManager}"`)
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
    setPackageManager(response)
  }
  return response
}
