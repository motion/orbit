import { AppView, AppViewProps, SubPane } from '@o/kit'
import { App } from '@o/stores'
import { memoize } from 'lodash'
import React from 'react'

import { MENU_WIDTH } from '../../constants'
import { useMenuStore } from './MenuStore'

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

export function MenuApp(props: MenuAppProps & { index: number }) {
  const menuStore = useMenuStore()
  // const { menuStore } = useStores()
  // memo to prevent expensive renders on height changes
  const menuApp = React.useMemo(() => {
    return <AppView viewType="index" {...props} />
  }, [JSON.stringify(props)])

  return (
    <SubPane
      id={props.id}
      paddingLeft={0}
      paddingRight={0}
      offsetY={menuStore.aboveHeight}
      onChangeHeight={menuHeightSetter(props.index)}
      transition="opacity ease 100ms"
    >
      {menuApp}
    </SubPane>
  )
}
