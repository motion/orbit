import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
// @ts-ignore
import icon from './gmail.svg'
import { GmailApp } from './views/GmailApp'
import { GmailItem } from './views/GmailItem'
import GmailSettings from './views/GmailSettings'

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
