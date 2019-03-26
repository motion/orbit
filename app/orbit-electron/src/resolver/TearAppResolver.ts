import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { TearAppCommand } from '@o/models'
import { Electron } from '@o/stores'
import { app, dialog } from 'electron'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import { ROOT } from '../constants'
import { getOrbitShortcutsStore } from '../orbit/OrbitWindow'
import forkAndStartOrbitApp from '../helpers/forkAndStartOrbitApp'

const log = new Logger('TearAppResolver')

// TODO umed can we make this type not bread
export const TearAppResolver: any = resolveCommand(TearAppCommand, async ({ appType, appId }) => {
  log.info('Tearing app', appType, appId)

  const iconPath = join(ROOT, 'resources', 'icons', `appicon-${appType}.png`)
  if (!(await pathExists(iconPath))) {
    dialog.showErrorBox('No icon found for app...', 'Oops')
    console.error('no icon!', iconPath)
    return
  } else {
    app.dock.setIcon(iconPath)
  }

  Electron.setIsTorn()
  getOrbitShortcutsStore().dispose()

  forkAndStartOrbitApp({appId})
})
