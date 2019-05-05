import { clipboard } from 'electron'

import { AllStores } from '../StoreContext'

export const copyAppLink = (stores: AllStores) => () => {
  const { locationStore } = stores
  clipboard.writeText(locationStore.urlString)
}
