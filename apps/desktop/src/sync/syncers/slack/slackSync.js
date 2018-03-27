import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync.js'

export default new Syncer({
  settings: {
    type: 'slack',
    actions: {
      attachments: { every: 60 * 60 * 24 },
    },
  },
  syncers: {
    attachments: SlackAttachmentSync,
  },
})
