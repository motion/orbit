import Syncer from '../syncer'
import {ConfluenceSync} from './ConfluenceSync'

export const confluence = new Syncer('confluence', {
  actions: {
    bit: { secondsBetween: 60 },
  },
  getSyncers: setting => {
    return {
      bit: new ConfluenceSync(setting),
    }
  },
})
