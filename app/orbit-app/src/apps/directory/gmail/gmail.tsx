import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/gmail.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GmailApp } from './views/GmailApp'
import { GmailItem } from './views/GmailItem'
import { GmailSettings } from './views/GmailSettings'

export const gmail: GetOrbitApp<'gmail'> = (setting?: Setting) => ({
  id: setting.id,
  source: 'bit',
  integration: 'gmail',
  integrationName: 'Gmail',
  defaultQuery: findManyType('gmail'),
  display: {
    name: setting.name,
    icon,
  },
  views: {
    main: GmailApp,
    item: GmailItem,
    setting: GmailSettings,
  },
})
