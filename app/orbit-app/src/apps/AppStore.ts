import { ensure, react } from '@mcro/black'
import { AppModel } from '@mcro/models'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { observeOne } from '../mediator'
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
      defaultValue: '',
      deferFirstRun: true,
    },
  )

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
