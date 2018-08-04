import * as Constants from '../constants'
import Path from 'path'
import Fs from 'fs-extra'

export default async function recoverDB() {
  const backupDB = Path.join(Constants.ROOT_DIR, 'app_data', 'database.bak')
  const mainDB = Path.join(Constants.ROOT_DIR, 'app_data', 'database')
  if (await Fs.exists(backupDB)) {
    await Fs.remove(mainDB)
    await Fs.copy(backupDB, mainDB)
    // @ts-ignore
    global.restart()
  }
}
