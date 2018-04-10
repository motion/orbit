import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync'
import SlackMessagesSync from './slackMessagesSync'

export default new Syncer('slack', {
  actions: {
    messages: { every: 60 * 1 },
    // attachments: { every: 60 * 60 * 24 },
  },
  getSyncers: setting => ({
    attachments: new SlackAttachmentSync(setting),
    messages: new SlackMessagesSync(setting),
  }),
})
