import { gloss, Row } from '@mcro/gloss'
import { ProvideStores, useApp } from '@mcro/kit'
import { BorderTop } from '@mcro/ui'
import React from 'react'
import { useStores } from '../../hooks/useStores'

const statusBarHeight = 26

export const OrbitStatusBarHeight = ({ appId }: { appId: string }) => {
  const { views } = useApp(appId)
  return <div style={{ height: views.statusBar ? statusBarHeight : 0 }} />
}

export default function OrbitStatusBar() {
  const { paneManagerStore } = useStores()
  const { views, appStore, provideStores } = useApp(paneManagerStore.activePane)
  const StatusBarView = views.statusBar

  if (!StatusBarView) {
    return null
  }

  return (
    <ProvideStores stores={provideStores}>
      <StatusBarChrome>
        <StatusBarView key={paneManagerStore.activePane.id} appStore={appStore} />
        <BorderTop />
      </StatusBarChrome>
    </ProvideStores>
  )
}

const StatusBarChrome = gloss(Row, {
  height: statusBarHeight,
  position: 'absolute',
  overflow: 'hidden',
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
