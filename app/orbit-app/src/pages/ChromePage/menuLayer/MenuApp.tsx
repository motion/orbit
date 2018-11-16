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
  const isActiveRef = React.useRef(() => props.menuStore.activeOrLastActiveMenuID === props.menuId)
  const isActive = isActiveRef.current
  const appStore = useStore(AppStore, {
    ...props,
    ...stores,
    isActive,
  })
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <MenuAppInner {...props} />
    </StoreContext.Provider>
  )
})

export const MenuAppInner = React.memo((props: MenuAppProps) => {
  const beforeHeight = 40
  return (
    <SubPane
      id={props.id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={beforeHeight}
      onChangeHeight={props.menuStore.menuHeightSetter(props.menuId)}
      transition="none"
    >
      <AppView viewType="index" {...props} />
    </SubPane>
  )
})
