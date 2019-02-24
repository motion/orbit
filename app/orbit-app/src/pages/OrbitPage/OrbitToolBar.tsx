import { FullScreen, gloss, Row } from '@mcro/gloss'
import { ProvideStores, useApp } from '@mcro/kit'
import { BorderBottom } from '@mcro/ui'
import React, { memo, useMemo } from 'react'
import { useStores } from '../../hooks/useStores'

const height = 30
const minHeight = 3

export const OrbitToolBarHeight = ({ appId }: { appId: string }) => {
  const { views } = useApp({ id: appId })
  return <div style={{ height: views.toolBar ? height : minHeight }} />
}

export default memo(function OrbitToolBar() {
  const { orbitStore, paneManagerStore } = useStores()
  const { views } = useApp({ id: paneManagerStore.activePane.type })
  const hasToolbar = !!views.toolBar
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
  const { id } = paneManagerStore.activePane
  const state = appsStore.appsState

  // memo all toolbars
  const toolbars = useMemo(
    () => {
      if (!state || !state.appViews) {
        return {}
      }
      const views = {}
      for (const key in state.appViews) {
        if (!state.appViews[key]) continue
        const { toolBar } = state.appViews[key]
        const appStore = state.appStores[key]
        views[key] = null
        if (toolBar) {
          const AppToolbar = toolBar
          views[key] = (
            <ProvideStores stores={state.provideStores[key]}>
              <AppToolbar appStore={appStore} />
            </ProvideStores>
          )
        }
      }
      return views
    },
    [state && Object.keys(state.appViews).join('')],
  )

  return (
    <>
      {Object.keys(toolbars).map(key => {
        const toolbarElement = toolbars[key]
        return (
          <ToolbarContent key={key} isActive={id === key}>
            {toolbarElement}
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
    y: -height + minHeight,
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
  height,
  transition: 'opacity ease 100ms',
  opacity: 0,
  hasToolbars: {
    opacity: 1,
    transform: {
      y: 0,
    },
  },
})
