import { Bit } from '@mcro/models'
import { AppConfig } from '@mcro/stores'

export function bitToAppConfig(bit: Bit): AppConfig {
  return {
    id: `${bit.id}`,
    icon: bit.integration || '',
    title: bit.title,
    type: 'bit',
    subType: bit.type,
    integration: bit.integration || '',
    config:
      bit.integration === 'app1'
        ? {
            dimensions: [750, 720],
          }
        : {
            contentSize: bit.body.length,
          },
  }
}
