import { isEditing } from '@o/stores'
import { once } from 'lodash'

import { defaultPanes } from '../effects/paneManagerStoreUpdatePanes'
import { om } from '../om/om'
import { AllStores } from '../StoreContext'

export function setInitialPaneIndex({ paneManagerStore }: AllStores) {
  return once(() => {
    if (isEditing) {
      return
    }
    paneManagerStore.setPaneIndex(defaultPanes.length)
    om.effects.router.start()
  })
}
