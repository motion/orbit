import * as React from 'react'
import { useContext } from 'react'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { StoreContext, react, ensure } from '@mcro/black'
import { SubPane } from '../../../components/SubPane'

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

export const MenuApp = React.memo((props: MenuAppProps) => {
  const store = useStore(MenuAppStore, props, { debug: true })
  const stores = useContext(StoreContext)
  const appStore = useStore(AppStore, { ...props, ...stores }, { debug: true })
  const isActive = () => props.menuStore.menuOpenID === props.menuId
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <Searchable
        inputProps={{
          forwardRef: store.handleSearchInput,
          onChange: appStore.queryStore.onChangeQuery,
        }}
      >
        <SubPane
          id={props.id}
          type={props.type}
          paddingLeft={0}
          paddingRight={0}
          onChangeHeight={props.menuStore.setHeight}
        >
          <AppView view="index" isActive={isActive} {...props} />
        </SubPane>
      </Searchable>
    </StoreContext.Provider>
  )
})
