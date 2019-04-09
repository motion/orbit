import { clipboard } from 'electron'
import { AllStores } from '../contexts/StoreContext'

export const copyAppLink = (stores: AllStores) => () => {
  const { locationStore } = stores
  clipboard.writeText(`app://${locationStore.urlString}`)
}
