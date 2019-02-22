import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { ConfluenceApp } from './ConfluenceApp'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceItem } from './ConfluenceItem'
import { ConfluenceSettings } from './ConfluenceSettings'
import { ConfluenceSetup } from './ConfluenceSetup'

export const confluence: GetOrbitIntegration<'confluence'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'confluence',
  appName: 'Confluence',
  display: {
    name: source.name,
    itemName: 'task',
    icon: confluenceIcon,
  },
  views: {
    main: ConfluenceApp,
    item: ConfluenceItem,
    setting: ConfluenceSettings,
    setup: ConfluenceSetup,
  },
})
