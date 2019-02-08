import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../../apps/AppView'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderBottom } from '../../views/Border'

const height = 32

export const OrbitControlsHeight = () => <div style={{ height }} />

export default observer(function OrbitToolBar() {
  const { orbitStore } = useStoresSafe()
  const id = orbitStore.activePane.id
  const { appViews, appStore } = useApp({
    type: orbitStore.activePane.type,
    id,
  })
  const AppView = appViews.toolBar

  return (
    <ToolbarChrome hasToolbars={!!AppView}>
      <ToolbarInner hasToolbars={!!AppView}>
        {!!AppView && <AppView key={id} appStore={appStore} />}
        {!!AppView && <BorderBottom opacity={0.25} />}
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
  height,
  hasToolbars: {
    padding: [0, 12],
  },
})
