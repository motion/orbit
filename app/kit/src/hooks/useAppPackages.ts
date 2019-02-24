import { config } from '../configureKit'

export function useAppPackages() {
  return config.getApps()
}
