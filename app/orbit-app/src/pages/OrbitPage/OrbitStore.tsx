import { deep, ensure, react } from '@mcro/black'
import { AppConfig, getIsTorn, HandleOrbitSelect } from '@mcro/kit'
import { useHook } from '@mcro/use-store'
import { comparer } from 'mobx'
import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)
  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }
  isEditing = false

  activeConfig: { [key: string]: AppConfig } = deep({
    search: { id: '', appId: 'search', title: '' },
  })

  get isTorn() {
    return getIsTorn()
  }

  setEditing = () => {
    this.isEditing = true
  }

  handleSelectItem: HandleOrbitSelect = (index, appConfig) => {
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
      if (!comparer.structural(this.activeConfig[id], appConfig)) {
        this.activeConfig[id] = appConfig
      }
    },
  )
}
