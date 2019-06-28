import { getAppDefinitions } from './getAppDefinitions'

export function getAppDefinition(identifier: string) {
  const res = getAppDefinitions().find(x => x.id === identifier)
  return res
}
