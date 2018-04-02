import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'
import GoogleMailSync from './googleMailSync'

export default new Syncer('google', {
  actions: {
    // drive: { every: 60 },
    mail: { every: 60 },
    // cal: { every: 60 * 5 }, // 5 minutes
  },
  getSyncers: setting => ({
    drive: new GoogleDriveSync(setting),
    mail: new GoogleMailSync(setting),
    cal: new GoogleCalSync(setting),
  }),
})
