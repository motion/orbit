import { open } from './open'
import { getGlobalConfig } from '@mcro/config'

export async function openAuth(appName: string) {
  open(`${getGlobalConfig().urls.auth}/auth/${appName}`)
}
