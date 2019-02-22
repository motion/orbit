import { GmailApp } from './GmailApp'
import { gmailIcon } from './gmailIcon'
import { GmailItem } from './GmailItem'
import GmailSettings from './GmailSettings'

export const gmail = {
  name: 'Gmail',
  modelType: 'bit',
  sourceType: 'gmail',
  itemName: 'thread',
  icon: gmailIcon,
  views: {
    main: GmailApp,
    item: GmailItem,
    setting: GmailSettings,
  },
}
