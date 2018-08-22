import { open } from './open'
import { getConfig } from '@mcro/config'

export async function openAuth(integrationName: string) {
  open(`${getConfig().privateUrl}/auth/${integrationName}`)
}
