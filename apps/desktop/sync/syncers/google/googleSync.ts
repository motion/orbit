import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'
import GoogleMailSync from './googleMailSync'

export default new Syncer('google', {
  actions: {
    drive: { secondsBetween: 60 * 2 },
    mail: { secondsBetween: 60 * 2 },
    // cal: { secondsBetween: 60 * 5 }, // 5 minutes
  },
  getSyncers: setting => ({
    drive: new GoogleDriveSync(setting),
    mail: new GoogleMailSync(setting),
    cal: new GoogleCalSync(setting),
  }),
})
