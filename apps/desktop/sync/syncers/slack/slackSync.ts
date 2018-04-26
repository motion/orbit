import Syncer from '../syncer'
import SlackAttachmentSync from './slackAttachmentSync'
import SlackMessagesSync from './slackMessagesSync'
import SlackPeopleSync from './slackPeopleSync'
import { SlackService } from '@mcro/services'

export default new Syncer('slack', {
  actions: {
    messages: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 60 * 20 },
    // attachments: { secondsBetween: 60 * 60 * 24 },
  },
  getSyncers: setting => {
    const slackService = new SlackService(setting)
    return {
      attachments: new SlackAttachmentSync(slackService),
      messages: new SlackMessagesSync(slackService),
      people: new SlackPeopleSync(slackService),
    }
  },
})
