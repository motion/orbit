import * as React from 'react'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { SubPane } from '../../../components/SubPane'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../../contexts'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

export const MenuApp = observer((props: MenuAppProps) => {
  const stores = useStoresSafe()
  const appStore = useStore(AppStore, {
    ...props,
    ...stores,
  })
  return (
    <StoreContext.Provider value={{ ...stores, appStore }}>
      <MenuAppInner {...props} />
    </StoreContext.Provider>
  )
})

export const MenuAppInner = React.memo((props: MenuAppProps) => {
  const id = `${props.id}`
  return (
    <SubPane
      id={id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={props.menuStore.aboveHeight}
      onChangeHeight={props.menuStore.menuHeightSetter(props.menuId)}
      transition="opacity ease 100ms"
    >
      <AppView id={id} type={props.type} viewType="index" {...props} />
    </SubPane>
  )
})
