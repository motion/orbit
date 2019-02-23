import { AppDefinition } from '@mcro/kit'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceSettings } from './ConfluenceSettings'
import { ConfluenceSetup } from './ConfluenceSetup'

export const app: AppDefinition = {
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  sync: {
    sourceType: 'confluence',
    settings: ConfluenceSettings,
    setup: ConfluenceSetup,
  },
}
