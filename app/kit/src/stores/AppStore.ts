import { observeOne } from '@o/bridge'
import { AppModel } from '@o/models'
import { ensure, react, useHook } from '@o/use-store'
import { useStoresSimple } from '../hooks/useStores'

export class AppStore {
  props: { id: string; identifier: string; isActive: boolean | (() => boolean) }
  stores = useHook(useStoresSimple)

  history = []
  selectedIndex = -1
  sidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
  lastSidebarWidth = react(() => this.sidebarWidth, {
    delayValue: true,
    defaultValue: this.sidebarWidth,
    log: false,
  })

  setSidebarWidth = next => {
    this.sidebarWidth = next
  }

  updateSidebar = react(
    () => this.stores.themeStore.showSidebar,
    shown => {
      this.sidebarWidth = shown ? this.lastSidebarWidth : 0
    },
  )

  get identifier() {
    return this.props.identifier
  }

  get id() {
    return this.props.id
  }

  get isActive() {
    const { isActive } = this.props
    if (typeof isActive === 'boolean') {
      return isActive
    }
    if (typeof isActive === 'function') {
      return isActive()
    }
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
