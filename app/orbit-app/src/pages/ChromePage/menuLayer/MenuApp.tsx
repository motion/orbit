import { App } from '@mcro/stores'
import { memoize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppView, AppViewProps } from '../../../apps/AppView'
import { SubPane } from '../../../components/SubPane'
import { MENU_WIDTH } from '../../../constants'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

type MenuAppProps = AppViewProps

const menuHeightSetter = memoize((index: number) => (height: number) => {
  App.setState({
    trayState: {
      menuState: {
        [index]: {
          size: [MENU_WIDTH, height],
        },
      },
    },
  })
})

export default observer(function MenuApp(props: MenuAppProps & { index: number }) {
  const { menuStore } = useStoresSafe()
  // memo to prevent expensive renders on height changes
  const menuApp = React.useMemo(
    () => {
      return <AppView viewType="index" {...props} />
    },
    [JSON.stringify(props)],
  )

  return (
    <SubPane
      id={props.id}
      type={props.type}
      paddingLeft={0}
      paddingRight={0}
      offsetY={menuStore.aboveHeight}
      onChangeHeight={menuHeightSetter(props.index)}
      transition="opacity ease 100ms"
    >
      {menuApp}
    </SubPane>
  )
})
