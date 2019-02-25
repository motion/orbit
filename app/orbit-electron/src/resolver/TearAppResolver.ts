import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { TearAppCommand } from '@mcro/models'
import { join } from 'path'
import { ROOT } from '../constants'
import { pathExists } from 'fs-extra'
import { app, dialog } from 'electron'
import { forkProcess } from '@mcro/orbit-fork-process'
import { appProcesses, getOrbitShortcutsStore } from '../orbit/OrbitWindow'
import { Electron } from '@mcro/stores'

const log = new Logger('TearAppResolver')

export const TearAppResolver: any = resolveCommand(
  TearAppCommand,
  async ({ appType, appId }) => {

  log.info('Tearing app', appType, appId)

    const iconPath = join(ROOT, 'resources', 'icons', `appicon-${appType}.png`)
    if (!(await pathExists(iconPath))) {
      dialog.showErrorBox('No icon found for app...', 'Oops')
      console.error('no icon!', iconPath)
      return
    }
    app.dock.setIcon(iconPath)
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