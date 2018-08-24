import { open } from './open'
import { getGlobalConfig } from '@mcro/config'

export async function openAuth(integrationName: string) {
  open(`${getGlobalConfig().privateUrl}/auth/${integrationName}`)
}
