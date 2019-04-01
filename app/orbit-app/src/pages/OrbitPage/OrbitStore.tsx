import { isEqual } from '@o/fast-compare'
import { AppProps } from '@o/kit'
import { ensure, react, shallow, useHook } from '@o/use-store'
import { getIsTorn } from '../../helpers/getIsTorn'
import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)

  lastSelectAt = {}
  nextItem = { index: -1, appProps: null, paneId: '' }
  isEditing = false
  activeConfig: { [key: string]: AppProps } = shallow({})

  get isTorn() {
    return getIsTorn()
  }

  setEditing = () => {
    this.isEditing = true
  }

  setSelectItem(paneId: string, index: number, appProps: AppProps) {
    // fast if not already set
    if (!this.activeConfig[paneId]) {
      this.activeConfig[paneId] = appProps
      return
    }
    const next = { paneId, index, appProps }
    if (!isEqual(next, this.nextItem)) {
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
    async ({ paneId, appProps }, { sleep }) => {
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt[paneId]
      this.lastSelectAt[paneId] = Date.now()
      if (Date.now() - last < 60) {
        await sleep(60)
      }
      ensure('app config', !!appProps)
      this.activeConfig[paneId] = appProps
    },
  )
}
