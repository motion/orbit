import { getAppDefinitions } from '../helpers/getAppDefinitions'

export function useAppDefinition(identifier: string) {
  return getAppDefinitions().find(x => x.id === identifier)
}
