import Syncer from '../syncer'
import GoogleDriveSync from './GoogleDriveSync'

export const gdocs = new Syncer('gdocs', {
  actions: {
    gdocs: { secondsBetween: 20 },
  },
  getSyncers: setting => ({
    gdocs: new GoogleDriveSync(setting),
  }),
})
