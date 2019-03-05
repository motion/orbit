import { createApp } from '@mcro/kit'
import { gmailIcon } from './gmailIcon'
import { GmailSettings } from './GmailSettings'

export default createApp({
  id: 'gmail',
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  settings: GmailSettings,
  sync: {},
})
