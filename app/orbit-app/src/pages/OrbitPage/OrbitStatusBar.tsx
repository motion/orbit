import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderTop } from '../../views/Border'

const statusBarHeight = 26

export const OrbitStatusBarHeight = () => <div style={{ height: statusBarHeight }} />

export default observer(function OrbitStatusBar() {
  const { orbitStore } = useStoresSafe()
  const { appViews, appStore } = useApp(orbitStore.activePane)
  const AppView = appViews.statusBar

  if (!AppView) {
    return null
  }

  return (
    <StatusBarChrome>
      <AppView key={orbitStore.activePane.id} appStore={appStore} />
      <BorderTop />
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
  padding: [0, 8],
}).theme((_, theme) => ({
  background: theme.background.darken(0.05),
}))
