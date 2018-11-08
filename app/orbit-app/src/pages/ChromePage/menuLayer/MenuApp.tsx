import * as React from 'react'
import { useContext } from 'react'
import { Menu } from './Menu'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { StoreContext } from '@mcro/black'

export function MenuApp(props: MenuAppProps) {
  const stores = useContext(StoreContext)
  const appStore = useStore(AppStore, { ...props, ...stores })
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <Menu id={props.id} width={300} menusStore={props.menusStore}>
        {isOpen => (
          <Searchable
            inputProps={{
              forwardRef: props.menusStore.handleSearchInput(props.id),
              onChange: appStore.queryStore.onChangeQuery,
            }}
          >
            <AppView view="index" isActive={isOpen} {...props} />
          </Searchable>
        )}
      </Menu>
    </StoreContext.Provider>
  )
}
