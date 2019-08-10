import { getApps } from './createApp'

export function getAppDefinition(identifier?: string) {
  return getApps().find(x => x.id === identifier)
}
