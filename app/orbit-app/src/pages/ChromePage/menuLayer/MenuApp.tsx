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
  const appStore = useStore(AppStore, { ...props, ...stores })
  const isActive = () => props.menuStore.menuOpenID === props.menuId
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <SubPane
        id={props.id}
        type={props.type}
        paddingLeft={0}
        paddingRight={0}
        onChangeHeight={props.menuStore.setHeight}
        before={<div style={{ height: 40 }} />}
      >
        <AppView view="index" isActive={isActive} {...props} />
      </SubPane>
    </StoreContext.Provider>
  )
})
