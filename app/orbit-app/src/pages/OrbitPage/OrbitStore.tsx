import { isEqual } from '@o/fast-compare'
import { AppProps, HandleOrbitSelect } from '@o/kit'
import { ensure, react, shallow, useHook } from '@o/use-store'
import { getIsTorn } from '../../helpers/getIsTorn'
import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)

  lastSelectAt = {}
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
    const next = { index, appProps }
    if (!this.activeConfig[this.activePaneId]) {
      this.activeConfig[this.activePaneId] = appProps
    } else if (!isEqual(next, this.nextItem)) {
      this.nextItem = next
    }
  }

  setActiveConfig(id: string, config: AppProps) {
    this.activeConfig[id] = config
  }

  get activePaneId() {
    return this.stores.paneManagerStore.activePane.id
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appProps }, { sleep }) => {
      const { activePaneId } = this
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt[activePaneId]
      this.lastSelectAt[activePaneId] = Date.now()
      if (Date.now() - last < 50) {
        await sleep(50)
      }
      ensure('app config', !!appProps)
      this.activeConfig[activePaneId] = appProps
    },
  )
}
