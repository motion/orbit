import { WebsiteApp } from './views/WebsiteApp'
import { WebsiteSources } from './views/WebsiteSources'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/website.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { WebsiteItem } from './views/WebsiteItem'
import { WebsiteSetup } from './views/WebsiteSetup'

export const website: GetOrbitIntegration<'website'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'website',
  appName: 'Website',
  defaultQuery: findManyType('website'),
  display: {
    name: setting.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: WebsiteApp,
    item: WebsiteItem,
    setting: WebsiteSources,
    setup: WebsiteSetup,
  },
})
