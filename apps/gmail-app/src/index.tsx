import { createApp } from '@o/kit'

import { graph } from './api.graph.node'
import { GmailApi } from './api.node'
import { gmailIcon } from './gmailIcon'
import { GmailSettings } from './GmailSettings'

export default createApp({
  id: 'gmail',
  name: 'Gmail',
  icon: gmailIcon,
  itemType: 'thread',
  settings: GmailSettings,
  sync: true,
  api: GmailApi,
  graph,
})
