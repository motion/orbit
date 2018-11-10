import * as React from 'react'
import { useContext } from 'react'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { StoreContext, react, ensure } from '@mcro/black'

class MenuAppStore {
  props: MenuAppProps

  searchInput: HTMLInputElement = null

  handleSearchInput = (ref: HTMLInputElement) => {
    this.searchInput = ref
  }

  focusInputOnOpen = react(
    () => this.props.menuStore.focusedMenu,
    async id => {
      ensure('matching id', id && +id === this.props.menuId)
      ensure('this.searchInput', !!this.searchInput)
      this.searchInput.focus()
    },
    {
      deferFirstRun: true,
    },
  )
}

export function MenuApp(props: MenuAppProps) {
  const store = useStore(MenuAppStore, props)
  const stores = useContext(StoreContext)
  const appStore = useStore(AppStore, { ...props, ...stores })
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <Searchable
        inputProps={{
          forwardRef: store.handleSearchInput,
          onChange: appStore.queryStore.onChangeQuery,
        }}
      >
        <AppView view="index" isActive={props.menuStore.menuOpenID === props.menuId} {...props} />
      </Searchable>
    </StoreContext.Provider>
  )
}
