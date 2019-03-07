import { AppProps, HandleOrbitSelect } from '@o/kit'
import { ensure, react, shallow, useHook } from '@o/use-store'
import { getIsTorn } from '../../helpers/getIsTorn'
import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)

  lastSelectAt = Date.now()
  nextItem = { index: -1, appProps: null }
  isEditing = false
  activeConfig: { [key: string]: AppProps } = shallow({})

  get isTorn() {
    return getIsTorn()
  }

  setEditing = () => {
    this.isEditing = true
  }

  setSelectItem: HandleOrbitSelect = (index, appProps) => {
    this.nextItem = { index, appProps }
  }

  setActiveConfig(id: string, config: AppProps) {
    this.activeConfig[id] = config
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appProps }, { sleep }) => {
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()
      if (Date.now() - last < 50) {
        await sleep(50)
      }
      ensure('app config', !!appProps)
      const { id } = this.stores.paneManagerStore.activePane
      this.activeConfig[id] = appProps
    },
  )
}
