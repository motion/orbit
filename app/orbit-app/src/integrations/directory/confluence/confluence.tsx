import { ConfluenceApp } from './views/ConfluenceApp'
import { ConfluenceSources } from './views/ConfluenceSources'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/confluence.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { ConfluenceItem } from './views/ConfluenceItem'
import { ConfluenceSetup } from './views/ConfluenceSetup'

export const confluence: GetOrbitIntegration<'confluence'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'confluence',
  appName: 'Confluence',
  defaultQuery: findManyType('confluence'),
  display: {
    name: setting.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: ConfluenceApp,
    item: ConfluenceItem,
    setting: ConfluenceSources,
    setup: ConfluenceSetup,
  },
})
