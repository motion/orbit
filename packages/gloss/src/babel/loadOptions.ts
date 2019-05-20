import cosmiconfig from 'cosmiconfig'

import { StrictOptions } from '../types'

export type PluginOptions = StrictOptions & {
  configFile: string
}

const explorer = cosmiconfig('gloss')

export function loadOptions(overrides?: PluginOptions): StrictOptions {
  const { configFile, ...rest } = overrides || { configFile: undefined }
  const result = configFile !== undefined ? explorer.loadSync(configFile) : explorer.searchSync()
  const options = {
    displayName: false,
    evaluate: true,
    ignore: /node_modules/,
    ...(result ? result.config : null),
    ...rest,
  }
  return options
}
