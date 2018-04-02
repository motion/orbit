import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'

export default new Syncer('google', {
  actions: {
    drive: { every: 60 },
    cal: { every: 60 * 5 }, // 5 minutes
  },
  syncers: setting => ({
    drive: new GoogleDriveSync(setting),
    cal: new GoogleCalSync(setting),
  }),
})
