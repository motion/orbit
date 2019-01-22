import { observer } from 'mobx-react-lite'
import * as React from 'react'
import AppView, { AppViewProps } from '../../../apps/AppView'
import { SubPane } from '../../../components/SubPane'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

type MenuAppProps = AppViewProps & {
  menuId: number
}

function MenuApp({ menuId, ...appProps }: MenuAppProps) {
  const { menuStore } = useStoresSafe()
  console.log('MenuApp', menuId, appProps)

  // memo to prevent expensive renders on height changes
  const menuApp = React.useMemo(
    () => {
      return <AppView viewType="index" {...appProps} />
    },
    [JSON.stringify(appProps)],
  )

  return (
    <SubPane
      id={menuId}
      type={appProps.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={menuStore.aboveHeight}
      onChangeHeight={menuStore.menuHeightSetter(menuId)}
      transition="opacity ease 100ms"
    >
      {menuApp}
    </SubPane>
  )
}

export default observer(MenuApp)
