import { gloss, Row, RowProps } from 'gloss'
import { AppLoadContext } from '@o/kit'
import { BorderTop } from '@o/ui'
import { useReaction } from '@o/use-store'
import React, { useContext } from 'react'

import { useStoresSimple } from '../../hooks/useStores'

const statusBarHeight = 26

export const statusbarPadElement = <div style={{ height: statusBarHeight }} />

export function OrbitStatusBar({ children }) {
  const { id } = useContext(AppLoadContext)
  const { paneManagerStore } = useStoresSimple()
  const isActive = useReaction(() => paneManagerStore.activePane.id === id)
  return (
    <StatusBarChrome isActive={isActive}>
      {children}
      <BorderTop />
    </StatusBarChrome>
  )
}

const StatusBarChrome = gloss<RowProps & { isActive?: boolean }>(Row, {
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
  opacity: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    pointerEvents: 'auto',
  },
}).theme((_, theme) => ({
  background: theme.background,
}))
