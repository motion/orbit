import { config } from '../configureKit'
import { useReloadAppDefinitions } from './useReloadAppDefinitions'

export function useAppDefinitions() {
  useReloadAppDefinitions()
  return config.getLoadedApps()
}
