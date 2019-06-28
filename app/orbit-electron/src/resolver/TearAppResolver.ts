import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { TearAppCommand } from '@o/models'
import { Electron } from '@o/stores'
import { app } from 'electron'
import { pathExists } from 'fs-extra'
import { join } from 'path'

import { ROOT } from '../constants'
import { forkAndStartOrbitApp } from '../helpers/forkAndStartOrbitApp'

const log = new Logger('TearAppResolver')

export const TearAppResolver: any = resolveCommand(TearAppCommand, async ({ appType, appId }) => {
  log.info('Tearing app', appType, appId)
  const iconPath = join(ROOT, 'resources', 'icons', `appicon-${appType}.png`)
  if (!(await pathExists(iconPath))) {
    // dialog.showErrorBox('No icon found for app...', 'Oops')
    console.error('no icon for this app, not setting', iconPath)
  } else {
    app.dock.setIcon(iconPath)
  }

  const currentWindow = Electron.curMainWindow

  Electron.setState({
    // hide the next window
    showOrbitMain: false,
    // tear a new window
    appWindows: {
      ...Electron.state.appWindows,
      // tear current window
      [currentWindow.appId]: {
        ...currentWindow,
        appRole: 'torn',
      },
      // launch new main window
      [appId]: {
        appId,
        appRole: 'main',
      },
    },
  })

  forkAndStartOrbitApp({ appId })
})
