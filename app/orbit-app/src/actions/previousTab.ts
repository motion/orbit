import { AllStores } from '../contexts/StoreContext'

export function previousTab({ newAppStore, paneManagerStore }: AllStores) {
  return async () => {
    paneManagerStore.back()
    newAppStore.setShowCreateNew(false)
  }
}
