import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppProps } from '../../../apps/AppProps'
import AppView from '../../../apps/AppView'
import { SubPane } from '../../../components/SubPane'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

type MenuAppProps = Partial<AppProps<any>> & {
  menuId: number
}

function MenuApp(props: MenuAppProps) {
  const { menuStore } = useStoresSafe()
  console.log('MenuApp', props)
  return (
    <SubPane
      id={props.id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={menuStore.aboveHeight}
      onChangeHeight={menuStore.menuHeightSetter(props.menuId)}
      transition="opacity ease 100ms"
    >
      <AppView key={props.id} id={props.id} type={props.type} viewType="index" {...props} />
    </SubPane>
  )
}

export default observer(MenuApp)
