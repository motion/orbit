import { gloss, Row } from '@o/gloss'
import { AppLoadContext, AppMainViewProps } from '@o/kit'
import { Toolbar, View, ViewProps } from '@o/ui'
import { useReaction } from '@o/use-store'
import React, { memo, useContext } from 'react'
import { useStoresSimple } from '../../hooks/useStores'

const toolbarHeight = 36

export const ToolBarPad = (p: { hasToolbar: boolean; hasSidebar: boolean }) => (
  <div
    style={{ pointerEvents: 'none', height: p.hasToolbar ? toolbarHeight : p.hasSidebar ? 0 : 0 }}
  />
)

export const OrbitToolBar = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
  const { paneManagerStore } = useStoresSimple()
  const isActive = useReaction(() => paneManagerStore.activePane.id === id)
  return (
    <OrbitToolbarChrome transparent={appDef.config && appDef.config.transparentBackground}>
      <ToolbarInner minHeight={props.hasSidebar ? 0 : 0} isActive={isActive}>
        <Toolbar padding={0} background="transparent" alignItems="center" justifyContent="center">
          {props.children}
        </Toolbar>
      </ToolbarInner>
    </OrbitToolbarChrome>
  )
})

const OrbitToolbarChrome = gloss(Row, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100000000,
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
  height: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    height: toolbarHeight,
    pointerEvents: 'auto',
  },
})
