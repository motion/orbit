import { AppDefinition } from '@mcro/kit'
import { ConfluenceApp } from './ConfluenceApp'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceItem } from './ConfluenceItem'
import { ConfluenceSettings } from './ConfluenceSettings'
import { ConfluenceSetup } from './ConfluenceSetup'

export const app: AppDefinition = {
  name: 'Confluence',
  itemType: 'task',
  sourceType: 'confluence',
  icon: confluenceIcon,
  views: {
    app: ConfluenceApp,
    item: ConfluenceItem,
    setting: ConfluenceSettings,
    setup: ConfluenceSetup,
  },
}
