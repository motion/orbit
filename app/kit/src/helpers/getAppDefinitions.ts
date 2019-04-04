import { config } from '../configureKit'

export function getAppDefinitions() {
  return (config.getApps && config.getApps()) || []
}
