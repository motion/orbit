import Syncer from '../syncer'
import ConfluenceBitSync from './ConfluenceBitSync'
import ConfluencePersonSync from './ConfluencePersonSync'

export const github = new Syncer('confluence', {
  actions: {
    task: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 60 * 5 },
  },
  getSyncers: setting => ({
    task: new ConfluenceBitSync(setting),
    people: new ConfluencePersonSync(setting),
  }),
})
