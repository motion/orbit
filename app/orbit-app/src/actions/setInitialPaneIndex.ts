import { once } from 'lodash'
import { AllStores } from '../contexts/StoreContext'
import { defaultPanes } from '../effects/paneManagerStoreUpdatePanes'
import { getIsTorn } from '../helpers/getIsTorn'

export function setInitialPaneIndex({ paneManagerStore }: AllStores) {
  return once(() => {
    if (getIsTorn()) {
      return
    }
    paneManagerStore.setPaneIndex(defaultPanes.length)
  })
}
