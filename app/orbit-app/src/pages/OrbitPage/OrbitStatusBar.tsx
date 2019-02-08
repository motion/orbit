import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAppView } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderTop } from '../../views/Border'

export const statusBarHeight = 32

export default observer(function OrbitStatusBar() {
  const { orbitStore } = useStoresSafe()
  const id = orbitStore.activePane.id
  const { AppView, appStore } = useAppView({
    viewType: 'statusBar',
    type: orbitStore.activePane.type,
    id,
  })

  if (!AppView) {
    return null
  }

  return (
    <StatusBarChrome>
      <AppView key={id} appStore={appStore} />
      <BorderTop opacity={0.25} />
    </StatusBarChrome>
  )
})

const StatusBarChrome = gloss(Row, {
  height: statusBarHeight,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
}).theme(({ hasToolbars }, theme) => ({
  zIndex: hasToolbars ? 1000000000 : -1,
  background: hasToolbars ? theme.tabBackgroundBottom || theme.background : 'transparent',
}))
