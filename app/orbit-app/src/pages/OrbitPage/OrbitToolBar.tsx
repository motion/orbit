import { AppLoadContext, AppMainViewProps } from '@o/kit'
import { Toolbar, View, ViewProps } from '@o/ui'
import { Block, gloss, Stack, StackProps } from 'gloss'
import React, { memo, useContext } from 'react'

import { usePaneManagerStore } from '../../om/stores'

const toolbarHeight = 36

export const ToolBarPad = (p: { hasToolbar: boolean; hasSidebar: boolean }) => (
  <Block pointerEvents="none" height={p.hasToolbar ? toolbarHeight : p.hasSidebar ? 0 : 0} />
)

export const OrbitToolBar = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
  const paneManagerStore = usePaneManagerStore()
  const isActive = paneManagerStore.activePane.id === `${id}`
  if (!appDef) {
    return null
  }
  return (
    <OrbitToolbarChrome transparent={appDef.viewConfig && appDef.viewConfig.transparentBackground}>
      <ToolbarInner minHeight={props.hasSidebar ? 0 : 0} isActive={isActive}>
        <Toolbar
          border={false}
          padding={0}
          background="transparent"
          alignItems="center"
          justifyContent="center"
        >
          {props.children}
        </Toolbar>
      </ToolbarInner>
    </OrbitToolbarChrome>
  )
})

const OrbitToolbarChrome = gloss<StackProps & { transparent?: boolean }>(Stack, {
  flexDirection: 'row',
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
  flexDirection: 'row',
  opacity: 0,
  height: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    height: toolbarHeight,
    pointerEvents: 'auto',
  },
})
