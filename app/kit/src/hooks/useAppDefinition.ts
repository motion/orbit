import { getAppDefinition } from '../helpers/getAppDefinition'
import { AppDefinition } from '../types/AppDefinition'
import { useStores } from './useStores'

export function useAppDefinition(): AppDefinition {
  const { appStore } = useStores()
  return getAppDefinition(appStore.identifier)
}
