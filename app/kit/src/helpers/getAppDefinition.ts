import { getAppDefinitions } from '../helpers/getAppDefinitions';

export function getAppDefinition(id: string) {
  return getAppDefinitions().find(x => x.id === id)
}
