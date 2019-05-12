import { createApi, createApp } from '@o/kit'

import { GmailApi } from './api.node'
import { gmailIcon } from './gmailIcon'
import { GmailSettings } from './GmailSettings'
import { graph } from './graph.node'

export default createApp({
  id: 'gmail',
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  settings: GmailSettings,
  sync: true,
  api: createApi<typeof GmailApi>(),
  graph,
})
