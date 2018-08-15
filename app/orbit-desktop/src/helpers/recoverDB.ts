import Path from 'path'
import Fs from 'fs-extra'
import { getConfig } from '../config'

export default async function recoverDB() {
  const { root } = getConfig().directories
  const backupDB = Path.join(root, 'app_data', 'database.bak')
  const mainDB = Path.join(root, 'app_data', 'database.sqlite')
  // @ts-ignore bad typedefs
  if (await Fs.exists(backupDB)) {
    await Fs.remove(mainDB)
    await Fs.copy(backupDB, mainDB)
    // @ts-ignore
    global.restart()
  }
}
