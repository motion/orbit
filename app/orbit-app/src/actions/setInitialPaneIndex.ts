import { defaultPanes, getIsTorn } from '@mcro/kit'
import { once } from 'lodash'
import { AllStores } from '../contexts/StoreContext'

export function setInitialPaneIndex({ paneManagerStore }: AllStores) {
  return once(() => {
    if (getIsTorn()) {
      return
    }
    paneManagerStore.setPaneIndex(defaultPanes.length)
  })
}
