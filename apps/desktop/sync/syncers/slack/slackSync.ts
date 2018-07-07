import Syncer from '../syncer'
import SlackAttachmentSync from './SlackAttachmentSync'
import SlackMessagesSync from './SlackMessagesSync'
import SlackPeopleSync from './SlackPeopleSync'

export const slack = new Syncer('slack', {
  actions: {
    messages: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 60 * 20 },
    // attachments: { secondsBetween: 60 * 60 * 24 },
  },
  getSyncers: setting => {
    return {
      attachments: new SlackAttachmentSync(setting),
      messages: new SlackMessagesSync(setting),
      people: new SlackPeopleSync(setting),
    }
  },
})
