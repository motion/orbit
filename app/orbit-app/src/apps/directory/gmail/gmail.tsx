import { Setting, GenericBit } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/gmail.svg'
import { GetOrbitApp, ItemProps } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GmailApp } from './views/GmailApp'
import { GmailItem } from './views/GmailItem'
import { GmailSettings } from './views/GmailSettings'

export const gmail: GetOrbitApp<'gmail'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'slack',
  integrationName: 'Slack',
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
