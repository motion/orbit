import { config } from '../configureKit'

export function useAppDefinitions() {
  return config.getLoadedApps()
}
