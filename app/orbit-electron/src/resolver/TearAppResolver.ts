import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { TearAppCommand } from '@o/models'
import { Electron } from '@o/stores'
import { app, dialog } from 'electron'
import { pathExists } from 'fs-extra'
import { join } from 'path'

import { ROOT } from '../constants'
import { forkAndStartOrbitApp } from '../helpers/forkAndStartOrbitApp'

const log = new Logger('TearAppResolver')

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
  forkAndStartOrbitApp({ appId })
})
