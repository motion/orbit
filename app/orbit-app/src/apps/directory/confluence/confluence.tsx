import { ConfluenceApp } from './views/ConfluenceApp'
import { ConfluenceSettings } from './views/ConfluenceSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/confluence.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { ConfluenceItem } from './views/ConfluenceItem'
import { ConfluenceSetup } from './views/ConfluenceSetup'

export const confluence: GetOrbitApp<'confluence'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'confluence',
  integrationName: 'Confluence',
  defaultQuery: findManyType('confluence'),
  display: {
    name: setting.name,
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
