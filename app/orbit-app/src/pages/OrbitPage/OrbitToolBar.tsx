import { useReaction } from '@mcro/black'
import { FullScreen, gloss, Row } from '@mcro/gloss'
import { ProvideStores, useApp } from '@mcro/kit'
import { BorderBottom } from '@mcro/ui'
import React, { memo } from 'react'
import { useStores } from '../../hooks/useStores'

const toolbarHeight = 30
const minHeight = 3

export const OrbitToolBarHeight = ({ appId }: { appId: string }) => {
  const { views } = useApp(appId)
  const height = views.toolBar ? toolbarHeight : minHeight
  return <div style={{ height }} />
}

export const OrbitToolBar = memo(function OrbitToolBar() {
  const { orbitStore, paneManagerStore } = useStores()
  const { views } = useApp(paneManagerStore.activePane.type)
  const hasToolbar = !!views.toolBar
  console.log('render toolbar', hasToolbar, paneManagerStore.activePane.type, views)
  return (
    <ToolbarChrome hasToolbars={hasToolbar}>
      <ToolbarInner hasToolbars={hasToolbar}>
        <OrbitToolBarContent />
        {!orbitStore.isTorn && hasToolbar && <BorderBottom opacity={0.5} />}
      </ToolbarInner>
    </ToolbarChrome>
  )
})

// keeping all toolbars alive at all times for now
// we really need some sort of reparenting/pausing in react

const OrbitToolBarContent = memo(() => {
  const { appsStore, paneManagerStore } = useStores()
  const { activePane } = paneManagerStore

  const toolbars = useReaction(() => {
    const res = {}
    for (const { type, id } of paneManagerStore.panes) {
      const state = appsStore.getApp(type, id)
      if (!state) continue
      const AppToolbar = state.views.toolBar
      res[id] = AppToolbar && (
        <ProvideStores stores={state.provideStores}>
          <AppToolbar appStore={state.appStore} />
        </ProvideStores>
      )
    }
    return res
  })

  return (
    <>
      {Object.keys(toolbars).map(id => {
        return (
          <ToolbarContent key={id} isActive={id === activePane.id}>
            {toolbars[id]}
          </ToolbarContent>
        )
      })}
    </>
  )
})

const ToolbarContent = gloss(FullScreen, {
  flexFlow: 'row',
  alignItems: 'center',
  padding: [0, 12],
  overflow: 'hidden',
  pointerEvents: 'none',
  opacity: 0,
  isActive: {
    pointerEvents: 'auto',
    opacity: 1,
  },
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
  transform: {
    y: -toolbarHeight + minHeight,
  },
  hasToolbars: {
    transform: {
      y: 0,
    },
  },
}).theme((_, theme) => ({
  background: theme.tabBackgroundBottom || theme.background,
}))

const ToolbarInner = gloss({
  flex: 2,
  flexFlow: 'row',
  height: toolbarHeight,
  transition: 'opacity ease 100ms',
  opacity: 0,
  hasToolbars: {
    opacity: 1,
    transform: {
      y: 0,
    },
  },
})
