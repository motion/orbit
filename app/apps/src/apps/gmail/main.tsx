import { AppDefinition } from '@mcro/kit'
import { gmailIcon } from './gmailIcon'
import GmailSettings from './GmailSettings'

export const id = 'gmail'

export const app: AppDefinition = {
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  sync: {
    sourceType: 'gmail',
    settings: GmailSettings,
  },
}
