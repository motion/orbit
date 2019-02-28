import { ensure, react, shallow } from '@mcro/black'
import { AppConfig, getIsTorn, HandleOrbitSelect } from '@mcro/kit'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)

  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }
  isEditing = false
  activeConfig: { [key: string]: AppConfig } = shallow({})

  get isTorn() {
    return getIsTorn()
  }

  setEditing = () => {
    this.isEditing = true
  }

  setSelectItem: HandleOrbitSelect = (index, appConfig) => {
    console.warn('????????????????', appConfig)
    this.nextItem = { index, appConfig }
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appConfig }, { sleep }) => {
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()
      if (Date.now() - last < 50) {
        await sleep(50)
      }
      ensure('app config', !!appConfig)
      const { id } = this.stores.paneManagerStore.activePane
      this.activeConfig[id] = appConfig
    },
  )
}
