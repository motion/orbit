import { createApi, createApp } from '@o/kit'
import { gmailIcon } from './gmailIcon'
import { GmailSettings } from './GmailSettings'
import { GmailApi } from './api.node'

export default createApp({
  id: 'gmail',
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  settings: GmailSettings,
  sync: {},
  api: createApi<typeof GmailApi>(),
})
