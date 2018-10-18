import { WebsiteApp } from './views/WebsiteApp'
import { WebsiteSettings } from './views/WebsiteSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/website.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { WebsiteItem } from './views/WebsiteItem'
import { WebsiteSetup } from './views/WebsiteSetup'

export const website: GetOrbitApp<'website'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'website',
  integrationName: 'Website',
  defaultQuery: findManyType('website'),
  display: {
    name: setting.name,
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
