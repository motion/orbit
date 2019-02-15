import { ensure, react } from '@mcro/black'
import { useHook } from '@mcro/use-store'
import { isEqual } from 'lodash'
import { AppConfig, AppType } from '../../apps/AppTypes'
import { getIsTorn } from '../../helpers/getAppHelpers'
import { useStoresSimple } from '../../hooks/useStores'
import { OrbitHandleSelect } from '../../views/Lists/OrbitList'

export class OrbitStore {
  stores = useHook(useStoresSimple)
  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }
  isEditing = false

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  get isTorn() {
    return getIsTorn()
  }

  setEditing = () => {
    this.isEditing = true
  }

  handleSelectItem: OrbitHandleSelect = (index, appConfig) => {
    this.nextItem = { index, appConfig }
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appConfig }, { sleep }) => {
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()
      if (Date.now() - last < 80) {
        await sleep(50)
      }
      ensure('app config', !!appConfig)
      const { id } = this.stores.paneManagerStore.activePane
      console.debug('selecting', id, appConfig)
      if (!isEqual(this.activeConfig[id], appConfig)) {
        this.activeConfig = {
          ...this.activeConfig,
          [id]: appConfig,
        }
      }
    },
  )
}
