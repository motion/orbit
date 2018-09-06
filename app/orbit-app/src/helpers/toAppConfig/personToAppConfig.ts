import { PersonBit } from '@mcro/models'
import { AppConfig } from '@mcro/stores'

export function personToAppConfig(person: PersonBit): AppConfig {
  return {
    id: person.email,
    icon: person.photo || '',
    title: person.name,
    body: '',
    type: 'person',
    integration: '',
    subType: '',
    config: {
      showTitleBar: false,
      dimensions: [600, 680],
    },
  }
}
