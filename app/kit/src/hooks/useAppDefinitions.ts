import { getApps, useReloadAppDefinitions } from '../helpers/createApp'

export function useAppDefinitions() {
  useReloadAppDefinitions()
  return getApps()
}
