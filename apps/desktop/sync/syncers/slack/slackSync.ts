import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync.js'

export default new Syncer('slack', {
  actions: {
    attachments: { every: 60 * 60 * 24 },
  },
  getSyncers: setting => ({
    attachments: new SlackAttachmentSync(setting),
  }),
})
