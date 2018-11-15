import * as React from 'react'
import { useContext } from 'react'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { StoreContext } from '@mcro/black'
import { SubPane } from '../../../components/SubPane'
import { memo } from '../../../helpers/memo'

export const MenuApp = memo((props: MenuAppProps) => {
  const stores = useContext(StoreContext)
  const appStore = useStore(AppStore, { ...props, ...stores })
  const isActive = React.useRef(() => props.menuStore.activeMenuID === props.menuId)
  const beforeHeight = 40
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <SubPane
        id={props.id}
        type={props.type}
        paddingLeft={0}
        paddingRight={0}
        offsetY={beforeHeight}
        onChangeHeight={props.menuStore.setHeight}
        transition="none"
      >
        <AppView viewType="index" isActive={isActive.current} {...props} />
      </SubPane>
    </StoreContext.Provider>
  )
})
