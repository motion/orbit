import Syncer from '../syncer'
import {GMailSync} from './GMailSync'

export const gmail = new Syncer('gmail', {
  actions: {
    gmail: { secondsBetween: 20 },
  },
  getSyncers: setting => ({
    gmail: new GMailSync(setting),
  }),
})
