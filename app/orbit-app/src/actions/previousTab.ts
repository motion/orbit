import { AllStores } from '../StoreContext'

export function previousTab({ newAppStore, paneManagerStore }: AllStores) {
  return async () => {
    paneManagerStore.back()
    newAppStore.setShowCreateNew(false)
  }
}
