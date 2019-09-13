import { react, useHooks } from '@o/use-store'

import { useStoresSimple } from '../hooks/useStores'
import { AppMenuItem } from '../views/App'

export class AppStore {
  props: {
    id: number
    identifier: string
  }

  hooks = useHooks(() => ({
    stores: useStoresSimple(),
  }))

  menuItems: AppMenuItem[] = []

  setMenuItems(items: AppMenuItem[]) {
    this.menuItems = items
  }

  sidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3.4))
  lastSidebarWidth = react(() => this.sidebarWidth, {
    delayValue: true,
    defaultValue: this.sidebarWidth,
    log: false,
  })

  setSidebarWidth = next => {
    this.sidebarWidth = next
  }

  get showSidebar() {
    if (!this.hooks.stores) {
      return false
    }
    return this.hooks.stores.themeStore.showSidebar
  }

  get identifier() {
    return this.props.identifier
  }

  get id() {
    return this.props.id
  }
}
