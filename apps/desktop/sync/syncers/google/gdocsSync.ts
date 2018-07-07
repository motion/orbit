import Syncer from '../syncer'
import GoogleDriveSync from './GoogleDriveSync'

export const gdocs = new Syncer('gdocs', {
  actions: {
    gdocs: { secondsBetween: 60 * 30 },
  },
  getSyncers: setting => ({
    gdocs: new GoogleDriveSync(setting),
  }),
})
