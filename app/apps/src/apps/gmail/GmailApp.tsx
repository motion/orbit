import { AppDefinition } from '@mcro/kit'
import { gmailIcon } from './gmailIcon'
import { GmailSettings } from './GmailSettings'

export const GmailApp: AppDefinition = {
  id: 'gmail',
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  settings: GmailSettings,
  sync: {},
}
