import { gloss, Row } from '@mcro/gloss'
import React, { memo } from 'react'
import { useApp } from '../../apps/AppView'
import { ProvideStores } from '../../components/ProvideStores'
import { useStores } from '../../hooks/useStores'

const height = 32
const minHeight = 3

export const OrbitToolBarHeight = ({ id }: { id: string }) => {
  const { appViews } = useApp({ id })
  return <div style={{ height: appViews.toolBar ? height : minHeight }} />
}

export default memo(function OrbitToolBar() {
  const { paneManagerStore } = useStores()
  const { appViews, appStore, provideStores } = useApp(paneManagerStore.activePane)
  const hasToolBar = !!appViews.toolBar
  const AppView = appViews.toolBar

  return (
    <ProvideStores stores={provideStores}>
      <ToolbarChrome hasToolbars={hasToolBar}>
        <ToolbarInner hasToolbars={hasToolBar}>
          {!!AppView && <AppView key={paneManagerStore.activePane.id} appStore={appStore} />}
          {/* {hasToolBar && <BorderBottom opacity={0.5} />} */}
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
