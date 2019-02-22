import { ConfluenceApp } from './ConfluenceApp'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceItem } from './ConfluenceItem'
import { ConfluenceSettings } from './ConfluenceSettings'
import { ConfluenceSetup } from './ConfluenceSetup'

export const confluence = {
  name: 'Confluence',
  itemName: 'task',
  modelType: 'bit',
  sourceType: 'confluence',
  icon: confluenceIcon,
  views: {
    main: ConfluenceApp,
    item: ConfluenceItem,
    setting: ConfluenceSettings,
    setup: ConfluenceSetup,
  },
}
