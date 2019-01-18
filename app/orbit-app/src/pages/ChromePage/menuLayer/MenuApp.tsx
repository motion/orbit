import * as React from 'react'
import AppView from '../../../apps/AppView'
import { SubPane } from '../../../components/SubPane'
import { MenuAppProps } from './MenuLayer'

function MenuApp(props: MenuAppProps) {
  console.log('MenuApp', props)
  return (
    <SubPane
      id={props.id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={props.menuStore.aboveHeight}
      onChangeHeight={props.menuStore.menuHeightSetter(props.menuId)}
      transition="opacity ease 100ms"
    >
      <AppView id={props.id} type={props.type} viewType="index" {...props} />
    </SubPane>
  )
}

export default MenuApp
