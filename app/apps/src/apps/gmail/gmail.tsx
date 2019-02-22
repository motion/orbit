import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { GmailApp } from './GmailApp'
import { gmailIcon } from './gmailIcon'
import { GmailItem } from './GmailItem'
import GmailSettings from './GmailSettings'

export const gmail: GetOrbitIntegration<'gmail'> = (source?: Source) => ({
  name: 'Gmail',
  modelType: 'bit',
  integration: 'gmail',
  display: {
    name: source.name,
    itemName: 'thread',
    icon: gmailIcon,
  },
  views: {
    main: GmailApp,
    item: GmailItem,
    setting: GmailSettings,
  },
})
