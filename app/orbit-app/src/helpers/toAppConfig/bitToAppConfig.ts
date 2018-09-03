import { Bit } from '@mcro/models'
import { AppConfig } from '@mcro/stores'

export function bitToAppConfig(bit: Bit): AppConfig {
  return {
    id: bit.id,
    icon: bit.integration || '',
    title: bit.title,
    body: bit.body || '',
    type: 'bit',
    subType: bit.type,
    integration: bit.integration || '',
  }
}
