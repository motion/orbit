import { AppDefinition } from '@o/models'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useReloadAppDefinitions } from './useReloadAppDefinitions'
import { useStores } from './useStores'

export function useAppDefinition(identifier?: string): AppDefinition {
  useReloadAppDefinitions()
  const { appStore } = useStores()
  return getAppDefinition(identifier || appStore.identifier)
}
