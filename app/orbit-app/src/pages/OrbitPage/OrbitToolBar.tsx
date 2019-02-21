import { Contents, gloss, Row } from '@mcro/gloss'
import { BorderBottom } from '@mcro/ui'
import React, { memo, useMemo } from 'react'
import { useApp } from '../../apps/useApp'
import { ProvideStores } from '../../components/ProvideStores'
import { useStores } from '../../hooks/useStores'

const height = 30
const minHeight = 3

export const OrbitToolBarHeight = ({ id }: { id: string }) => {
  const { appViews } = useApp({ id })
  return <div style={{ height: appViews.toolBar ? height : minHeight }} />
}

export default memo(function OrbitToolBar() {
  const { orbitStore, paneManagerStore } = useStores()
  const { appViews } = useApp(paneManagerStore.activePane)
  const hasToolbar = !!appViews.toolBar

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
      const appKeys = state && state.appViews ? Object.keys(state.appViews) : []
      const views = {}
      for (const key in appKeys) {
        if (!state.appViews[key]) continue
        console.log('loading toolbar', key, state)
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
    [state],
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

const ToolbarContent = gloss(Contents, {
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
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  height,
  padding: [0, 12],
  transition: 'opacity ease 100ms',
  opacity: 0,
  hasToolbars: {
    opacity: 1,
    transform: {
      y: 0,
    },
  },
})
