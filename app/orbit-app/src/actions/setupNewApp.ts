import { sleep } from '@mcro/black'
import { AllStores } from '../contexts/StoreContext'

export function setupNewApp({ newAppStore, paneManagerStore }: AllStores) {
  return async () => {
    newAppStore.setShowCreateNew(true)
    await sleep(10) // panemanager is heavy and this helps the ui from lagging
    paneManagerStore.setActivePane('createApp')
  }
}
