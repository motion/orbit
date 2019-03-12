import { save } from '@o/bridge'
import { AppModel } from '@o/models'
import { AllStores } from '../contexts/StoreContext'

export function createCustomApp(stores: AllStores) {
  save(AppModel, {
    name: 'My Custom App',
    spaceId: stores.spaceStore.activeSpace.id,
    identifier: `custom`,
    colors: ['green', 'darkgreen'],
  })
}
