import { isEditing } from '@o/stores'
import { once } from 'lodash'
import { AllStores } from '../contexts/StoreContext'
import { defaultPanes } from '../effects/paneManagerStoreUpdatePanes'

export function setInitialPaneIndex({ paneManagerStore }: AllStores) {
  return once(() => {
    if (isEditing) {
      return
    }
    paneManagerStore.setPaneIndex(defaultPanes.length)
  })
}
