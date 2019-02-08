import { Source } from '@mcro/models'
import icon from '../../../../public/icons/confluence.svg'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration } from '../../types'
import { ConfluenceApp } from './views/ConfluenceApp'
import { ConfluenceItem } from './views/ConfluenceItem'
import { ConfluenceSettings } from './views/ConfluenceSettings'
import { ConfluenceSetup } from './views/ConfluenceSetup'

export const confluence: GetOrbitIntegration<'confluence'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'confluence',
  appName: 'Confluence',
  defaultQuery: findManyType('confluence'),
  display: {
    name: source.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: ConfluenceApp,
    item: ConfluenceItem,
    setting: ConfluenceSettings,
    setup: ConfluenceSetup,
  },
})
