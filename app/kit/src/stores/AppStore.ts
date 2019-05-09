import { react, useHooks } from '@o/use-store'

import { useStoresSimple } from '../hooks/useStores'

export class AppStore {
  props: {
    id: string
    identifier: string
  }

  stores = useHooks({ stores: useStoresSimple }).stores

  sidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
  lastSidebarWidth = react(() => this.sidebarWidth, {
    delayValue: true,
    defaultValue: this.sidebarWidth,
    log: false,
  })

  setSidebarWidth = next => {
    this.sidebarWidth = next
  }

  get showSidebar() {
    return this.stores.themeStore.showSidebar
  }

  get identifier() {
    return this.props.identifier
  }

  get id() {
    return this.props.id
  }
}
