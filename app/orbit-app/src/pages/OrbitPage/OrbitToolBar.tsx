import { FullScreen, gloss, linearGradient, Row } from '@mcro/gloss'
import { useLoadedApp } from '@mcro/kit'
import React, { memo } from 'react'

const toolbarHeight = 30
const minHeight = 3

export const OrbitToolBarHeight = ({ identifier }: { identifier: string }) => {
  const { views } = useLoadedApp(identifier)
  const height = views.toolBar ? toolbarHeight : minHeight
  return <div style={{ height }} />
}

export const OrbitToolBar = memo((props: { children: any }) => {
  return (
    <ToolbarChrome>
      <ToolbarInner>
        <ToolbarContent>{props.children}</ToolbarContent>
      </ToolbarInner>
    </ToolbarChrome>
  )
})

const ToolbarContent = gloss(FullScreen, {
  flexFlow: 'row',
  alignItems: 'center',
  padding: [0, 12],
  overflow: 'hidden',
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

const ToolbarInner = gloss({
  flex: 2,
  flexFlow: 'row',
  height: toolbarHeight,
})
