import { observeOne } from '@mcro/bridge'
import { AppModel } from '@mcro/models'
import { ensure, react, useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppProps } from '../types/AppProps'

export class AppStore {
  props: Pick<AppProps, 'id' | 'isActive'>
  stores = useHook(useStoresSimple)

  history = []
  currentItems = []
  selectedIndex = -1

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
      defaultValue: '',
      deferFirstRun: true,
    },
  )

  getCurrentItems = () => {
    return this.currentItems
  }

  setCurrentItems = (items: any[]) => {
    this.currentItems = items
  }

  back = () => {}

  forward = () => {}

  app = react(() => {
    const numId = +this.id
    ensure('valid id', this.id === `${numId}`)
    return observeOne(AppModel, { args: { where: { id: numId } } })
  })

  get nlp() {
    return this.stores.queryStore.nlpStore.nlp
  }

  get queryFilters() {
    return this.stores.queryStore.queryFilters
  }

  get queryStore() {
    return this.stores.queryStore
  }

  get maxHeight() {
    const { subPaneStore } = this.stores
    if (subPaneStore) {
      return subPaneStore.maxHeight
    }
    return window.innerHeight - 50
  }
}
