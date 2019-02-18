import { gloss, Row } from '@mcro/gloss'
import { BorderBottom } from '@mcro/ui'
import React, { memo } from 'react'
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
  const { paneManagerStore, orbitStore } = useStores()
  const { appViews, appStore, provideStores } = useApp(paneManagerStore.activePane)
  const hasToolBar = !!appViews.toolBar
  const AppView = appViews.toolBar
  return (
    <ProvideStores stores={provideStores}>
      <ToolbarChrome hasToolbars={hasToolBar}>
        <ToolbarInner hasToolbars={hasToolBar}>
          {!!AppView && <AppView key={paneManagerStore.activePane.id} appStore={appStore} />}
          {!orbitStore.isTorn && hasToolBar && <BorderBottom />}
        </ToolbarInner>
      </ToolbarChrome>
    </ProvideStores>
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
