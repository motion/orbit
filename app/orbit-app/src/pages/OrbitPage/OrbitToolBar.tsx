import { FullScreen, gloss, Row, View, ViewProps } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, useAppDefinitions } from '@o/kit'
import { useReaction } from '@o/use-store'
import React, { memo, useContext } from 'react'
import { useStoresSimple } from '../../hooks/useStores'

const toolbarHeight = 30

export const ToolBarPad = (p: { hasToolbar: boolean; hasSidebar: boolean }) => (
  <div style={{ height: p.hasToolbar ? toolbarHeight : p.hasSidebar ? 0 : 0 }} />
)

export const OrbitToolBar = memo((props: AppMainViewProps) => {
  const { id, identifier } = useContext(AppLoadContext)
  const definition = useAppDefinitions().find(x => x.id === identifier)
  const { paneManagerStore } = useStoresSimple()
  const isActive = useReaction(() => paneManagerStore.activePane.id === id)
  return (
    <ToolbarChrome transparent={definition.config && definition.config.transparentBackground}>
      <ToolbarInner minHeight={props.hasSidebar ? 0 : 0} isActive={isActive}>
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
  zIndex: 1000000000000000000000000,
  transition: 'none',
  transparent: {
    background: 'transparent',
  },
}).theme((_, theme) => ({
  background: theme.background,
}))

const ToolbarInner = gloss<{ isActive: boolean } & ViewProps>(View, {
  flex: 2,
  flexFlow: 'row',
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
