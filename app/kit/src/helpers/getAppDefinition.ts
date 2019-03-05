import { getAppDefinitions } from '../helpers/getAppDefinitions'

export function getAppDefinition(identifier: string) {
  return getAppDefinitions().find(x => x.id === identifier)
}
