import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync.js'

export default setting =>
  new Syncer('slack', {
    setting,
    actions: {
      attachments: { every: 60 * 60 * 24 },
    },
    syncers: {
      attachments: new SlackAttachmentSync(setting),
    },
  })
