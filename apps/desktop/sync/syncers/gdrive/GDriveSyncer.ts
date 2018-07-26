import Syncer from '../syncer'
import {GDriveSync} from './GDriveSync'

export const gdocs = new Syncer('gdocs', {
  actions: {
    gdocs: { secondsBetween: 60 },
  },
  getSyncers: setting => ({
    gdocs: new GDriveSync(setting),
  }),
})
