import { remove } from 'fs-extra'
import { ensureOrbitVersionGreaterThan } from './helpers'
import { DATABASE_PATH } from '../../../constants'

export const resetDbIfOld = {
  condition: () => ensureOrbitVersionGreaterThan('2.2.239'),
  async run() {
    // reset db
    await remove(DATABASE_PATH)
    // @umed
    // TODO have it preserve their settings, extract that into helper functions
  },
}
