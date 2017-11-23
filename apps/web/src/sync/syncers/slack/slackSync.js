import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync.js'

@store
export default class SlackSync extends Syncer {
  static settings = {
    type: 'slack',
    actions: {
      attachments: { every: 60 * 1 },
    },
    syncers: {
      attachments: SlackAttachmentSync,
    },
  }
}
