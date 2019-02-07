import icon from '!raw-loader!../../../../public/icons/website.svg'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration } from '../../types'
import { WebsiteApp } from './views/WebsiteApp'
import { WebsiteItem } from './views/WebsiteItem'
import { WebsiteSettings } from './views/WebsiteSettings'
import { WebsiteSetup } from './views/WebsiteSetup'

export const website: GetOrbitIntegration<'website'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'website',
  appName: 'Website',
  defaultQuery: findManyType('website'),
  display: {
    name: source.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: WebsiteApp,
    item: WebsiteItem,
    setting: WebsiteSettings,
    setup: WebsiteSetup,
  },
})
