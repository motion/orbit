import Syncer from '../syncer'
import ConfluenceBitSync from './ConfluenceBitSync'
import ConfluencePersonSync from './ConfluencePersonSync'

export const confluence = new Syncer('confluence', {
  actions: {
    bit: { secondsBetween: 60 * 5 },
    person: { secondsBetween: 20 },
  },
  getSyncers: setting => {
    return {
      bit: new ConfluenceBitSync(setting),
      person: new ConfluencePersonSync(setting),
    }
  },
})
