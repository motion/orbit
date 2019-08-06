import { command } from '@o/bridge'
import { TearAppCommand } from '@o/models'
import { Electron } from '@o/stores'

import { appsCarouselStore } from '../../pages/OrbitPage/OrbitAppsCarousel'
import { appsDrawerStore } from '../../pages/OrbitPage/OrbitAppsDrawer'
import { paneManagerStore } from '../stores'

export async function openCurrentApp() {
  if (appsDrawerStore.isOpen) {
    return
  }
  if (appsCarouselStore.zoomedIn === false) {
    appsCarouselStore.zoomIntoCurrentApp()
  }
  const { type } = paneManagerStore.activePane
  const nextId = Object.keys(Electron.state.appWindows).length
  await command(TearAppCommand, {
    appType: type,
    windowId: nextId,
  })
}
