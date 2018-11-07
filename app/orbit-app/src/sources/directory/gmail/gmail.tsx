import { Source } from '@mcro/models'
import icon from '../../../../public/icons/gmail.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GmailApp } from './views/GmailApp'
import { GmailItem } from './views/GmailItem'
import { GmailSettings } from './views/GmailSettings'

export const gmail: GetOrbitIntegration<'gmail'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'gmail',
  appName: 'Gmail',
  defaultQuery: findManyType('gmail'),
  display: {
    name: source.name,
    itemName: 'thread',
    icon,
  },
  views: {
    main: GmailApp,
    item: GmailItem,
    setting: GmailSettings,
  },
})
