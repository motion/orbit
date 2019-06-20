import { AppBit, AppDefinition } from '@o/models'

export function newEmptyAppBit(definition: AppDefinition): AppBit {
  return {
    target: 'app',
    identifier: definition.id,
    itemType: definition.itemType,
    icon: definition.icon,
    name: definition.name,
    tabDisplay: 'plain',
    colors: ['#000', '#111'],
    token: '',
    data: {},
  }
}
