import { useReaction } from '@mcro/black'
import { FullScreen, gloss, linearGradient, Row } from '@mcro/gloss'
import { AppLoadContext } from '@mcro/kit'
import React, { memo, useContext } from 'react'
import { useStoresSimple } from '../../hooks/useStores'

const toolbarHeight = 30
const minHeight = 3

export const toolbarPadElement = <div style={{ height: toolbarHeight }} />

export const OrbitToolBar = memo((props: { children: any }) => {
  const { id } = useContext(AppLoadContext)
  const { paneManagerStore } = useStoresSimple()
  const isActive = useReaction(() => paneManagerStore.activePane.id === id)
  return (
    <ToolbarChrome>
      <ToolbarInner isActive={isActive}>
        <ToolbarContent>{props.children}</ToolbarContent>
      </ToolbarInner>
    </ToolbarChrome>
  )
})

const ToolbarChrome = gloss(Row, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  transition: 'none',
}).theme((_, theme) => ({
  background: linearGradient(theme.tabBackgroundBottom || theme.background, theme.background),
}))

const ToolbarInner = gloss<{ isActive: boolean }>({
  flex: 2,
  flexFlow: 'row',
  minHeight,
  opacity: 0,
  isActive: {
    opacity: 1,
    height: toolbarHeight,
  },
})

const ToolbarContent = gloss(FullScreen, {
  flexFlow: 'row',
  alignItems: 'center',
  padding: [0, 12],
  overflow: 'hidden',
})
