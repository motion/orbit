import { getAppDefinitions } from './getAppDefinitions'

export function getAppDefinition(identifier: string) {
  return getAppDefinitions().find(x => x.id === identifier)
}
