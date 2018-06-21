import Syncer from '../syncer'
import GoogleMailSync from './googleMailSync'

export const gmail = new Syncer('gmail', {
  actions: {
    gmail: { secondsBetween: 60 * 4 },
  },
  getSyncers: setting => ({
    gmail: new GoogleMailSync(setting),
  }),
})
