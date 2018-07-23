import Syncer from '../syncer'
import {SlackSync} from './SlackSync'

export const slack = new Syncer('slack', {
  actions: {
    slack: { secondsBetween: 50 },
  },
  getSyncers: setting => {
    return {
      slack: new SlackSync(setting),
    }
  },
})
