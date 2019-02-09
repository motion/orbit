import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderBottom } from '../../views/Border'

const height = 32
const minHeight = 3

export const OrbitToolBarHeight = ({ id }: { id: string }) => {
  const { appViews } = useApp({ id })
  return <div style={{ height: appViews.toolBar ? height : minHeight }} />
}

export default observer(function OrbitToolBar() {
  const { paneManagerStore } = useStoresSafe()
  const { appViews, appStore } = useApp(paneManagerStore.activePane)
  const hasToolBar = !!appViews.toolBar
  const AppView = appViews.toolBar

  return (
    <ToolbarChrome hasToolbars={hasToolBar}>
      <ToolbarInner hasToolbars={hasToolBar}>
        {!!AppView && <AppView key={paneManagerStore.activePane.id} appStore={appStore} />}
        {hasToolBar && <BorderBottom opacity={0.5} />}
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
  minHeight,
}).theme((_, theme) => ({
  background: theme.tabBackgroundBottom || theme.background,
}))

const ToolbarInner = gloss({
  flex: 2,
  flexFlow: 'row',
  alignItems: 'center',
  hasToolbars: {
    height: height,
    padding: [0, 12],
  },
})
