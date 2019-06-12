import { command } from '@o/bridge'
import { TearAppCommand } from '@o/models'
import { Electron } from '@o/stores'

import { paneManagerStore } from '../stores'

export async function openCurrentApp() {
  const { type } = paneManagerStore.activePane
  const nextId = Object.keys(Electron.state.appWindows).length
  console.log('openCurrentApp', type, nextId)
  await command(TearAppCommand, {
    appType: type,
    appId: nextId,
  })
}
