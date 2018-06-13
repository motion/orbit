import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'

export const gdocs = new Syncer('gdocs', {
  actions: {
    gdocs: { secondsBetween: 60 * 2 },
  },
  getSyncers: setting => ({
    gdocs: new GoogleDriveSync(setting),
  }),
})
