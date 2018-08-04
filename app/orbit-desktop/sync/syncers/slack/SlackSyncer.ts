import Syncer from '../syncer'
import {SlackSync} from './SlackSync'

export const slack = new Syncer('slack', {
  actions: {
    slack: { secondsBetween: 60 * 5 },
  },
  getSyncers: setting => {
    return {
      slack: new SlackSync(setting),
    }
  },
})
