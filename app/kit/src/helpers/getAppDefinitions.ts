import { config } from '../configureKit'

export function getAppDefinitions() {
  return (config.getLoadedApps && config.getLoadedApps()) || []
}
