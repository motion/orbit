import { gloss, Row } from '@mcro/gloss'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStores } from '../../hooks/useStores'
import { BorderTop } from '../../views/Border'

const statusBarHeight = 26

export const OrbitStatusBarHeight = ({ id }: { id: string }) => {
  const { appViews } = useApp({ id })
  return <div style={{ height: appViews.statusBar ? statusBarHeight : 0 }} />
}

export default function OrbitStatusBar() {
  const { paneManagerStore } = useStores()
  const { appViews, appStore } = useApp(paneManagerStore.activePane)
  const AppView = appViews.statusBar

  if (!AppView) {
    return null
  }

  return (
    <StatusBarChrome>
      <AppView key={paneManagerStore.activePane.id} appStore={appStore} />
      <BorderTop />
    </StatusBarChrome>
  )
}

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
