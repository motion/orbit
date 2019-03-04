import { gloss, Row } from '@mcro/gloss'
import { useLoadedApp } from '@mcro/kit'
import { BorderTop } from '@mcro/ui'
import React from 'react'

const statusBarHeight = 26

export const OrbitStatusBarHeight = ({ identifier }: { identifier: string }) => {
  const { views } = useLoadedApp(identifier)
  return <div style={{ height: views.statusBar ? statusBarHeight : 0 }} />
}

export function OrbitStatusBar({ children }) {
  return (
    <StatusBarChrome>
      {children}
      <BorderTop />
    </StatusBarChrome>
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
