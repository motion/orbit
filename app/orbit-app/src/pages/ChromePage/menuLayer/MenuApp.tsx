import * as React from 'react'
import { useContext } from 'react'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { StoreContext } from '@mcro/black'
import { SubPane } from '../../../components/SubPane'

export const MenuApp = React.memo((props: MenuAppProps) => {
  const stores = useContext(StoreContext)
  const appStore = useStore(
    AppStore,
    {
      ...props,
      ...stores,
      isActive: () => props.menuStore.activeOrLastActiveMenuID === props.menuId,
    },
    {
      debug: true,
    },
  )
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <MenuAppInner {...props} />
    </StoreContext.Provider>
  )
})

export const MenuAppInner = React.memo((props: MenuAppProps) => {
  console.log('render menuapp INNER WHY THE FUCK IS THIS RENDERING', props)
  const beforeHeight = 40
  return (
    <SubPane
      id={props.id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={beforeHeight}
      onChangeHeight={props.menuStore.setHeight}
      transition="none"
    >
      <AppView viewType="index" {...props} />
    </SubPane>
  )
})
