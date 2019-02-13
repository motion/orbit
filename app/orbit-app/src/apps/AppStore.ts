import { ensure, react } from '@mcro/black'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppProps } from './AppTypes'

export class AppStore {
  props: Pick<AppProps, 'id' | 'isActive'>
  stores = useHook(useStoresSimple)

  get id() {
    return this.props.id
  }

  get isActive() {
    const { id, isActive } = this.props
    if (typeof isActive === 'boolean') {
      return isActive
    }
    if (typeof isActive === 'function') {
      return isActive()
    }
    const { paneManagerStore } = this.stores
    if (paneManagerStore) {
      return paneManagerStore.activePane && paneManagerStore.activePane.id === id
    }
    console.warn('no active prop or paneManagerStore', this.stores, this.props)
    return false
  }

  activeQuery = react(
    () => [this.isActive, this.stores.queryStore.query],
    ([active, query]) => {
      ensure('active', active)
      return query
    },
    {
      defaultValue: this.stores.queryStore.query,
      deferFirstRun: true,
    },
  )

  get nlp() {
    return this.stores.queryStore.nlpStore.nlp
  }

  get queryFilters() {
    return this.stores.queryStore.queryFilters
  }

  get activeIndex() {
    if (!this.stores.selectionStore) {
      return -1
    }
    return this.stores.selectionStore.activeIndex
  }

  get spaceStore() {
    return this.stores.spaceStore
  }

  get queryStore() {
    return this.stores.queryStore
  }

  get paneNode() {
    return this.stores.subPaneStore.paneNode
  }

  get toggleSelected() {
    if (this.stores.selectionStore) {
      return this.stores.selectionStore.toggleSelected
    }
  }

  get maxHeight() {
    const { subPaneStore } = this.stores
    if (subPaneStore) {
      return subPaneStore.maxHeight
    }
    return window.innerHeight - 50
  }
}
