import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderBottom } from '../../views/Border'

const toolBarHeight = 32

export const OrbitToolBarHeight = observer(() => {
  const { paneManagerStore } = useStoresSafe()
  const { appViews } = useApp(paneManagerStore.activePane)
  return <div style={{ height: appViews.toolBar ? toolBarHeight : 0 }} />
})

export default observer(function OrbitToolBar() {
  const { paneManagerStore } = useStoresSafe()
  const { appViews, appStore } = useApp(paneManagerStore.activePane)
  const hasToolBar = !!appViews.toolBar
  const AppView = appViews.toolBar

  console.log('hasToolBar', hasToolBar)

  return (
    <ToolbarChrome hasToolbars={hasToolBar}>
      <ToolbarInner hasToolbars={hasToolBar}>
        {!!AppView && <AppView key={paneManagerStore.activePane.id} appStore={appStore} />}
        {hasToolBar && <BorderBottom opacity={0.25} />}
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
}).theme(({ hasToolbars }, theme) => ({
  zIndex: hasToolbars ? 1000000000 : -1,
  background: hasToolbars ? theme.tabBackgroundBottom || theme.background : 'transparent',
}))

const ToolbarInner = gloss({
  flex: 2,
  flexFlow: 'row',
  alignItems: 'center',
  toolBarHeight,
  hasToolbars: {
    height: toolBarHeight,
    padding: [0, 12],
  },
})
