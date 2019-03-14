import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { TearAppCommand } from '@o/models'
import { forkProcess } from '@o/orbit-fork-process'
import { Electron } from '@o/stores'
import { app, dialog } from 'electron'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import { ROOT } from '../constants'
import { appProcesses, getOrbitShortcutsStore } from '../orbit/OrbitWindow'

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

  const proc = forkProcess({
    name: 'orbit',
    // TODO we can increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
})
