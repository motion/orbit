import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderTop } from '../../views/Border'

export const statusBarHeight = 32

export default observer(function OrbitStatusBar() {
  const { orbitStore } = useStoresSafe()
  const id = orbitStore.activePane.id
  const { appViews, appStore } = useApp({ id: id || orbitStore.activePane.type })
  const AppView = appViews.statusBar

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
  zIndex: 1000000000,
}).theme((_, theme) => ({
  background: theme.tabBackgroundBottom || theme.background,
}))
