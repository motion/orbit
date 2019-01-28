import { gloss, Row, View } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { OrbitToolBarRender } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'

export default observer(function OrbitControls() {
  const { orbitStore } = useStoresSafe()
  return (
    <>
      {!orbitStore.isTorn ? (
        <ToolbarChrome>
          <OrbitToolBarRender>
            {toolbars => (
              <ToolbarInner hasToolbars={!!toolbars}>
                {toolbars && toolbars.before}
                <View flex={1} />
                {toolbars && toolbars.after}
              </ToolbarInner>
            )}
          </OrbitToolBarRender>
        </ToolbarChrome>
      ) : null}
    </>
  )
})

const ToolbarChrome = gloss(Row, {
  minHeight: 2,
  alignItems: 'center',
  justifyContent: 'center',
}).theme((_, theme) => ({
  background: theme.tabBackground,
  borderBottom: [1, theme.sidebarBorderColor],
}))

const ToolbarInner = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  maxWidth: 820,
  width: '75%',
  minWidth: 400,
  hasToolbars: {
    padding: [4, 10],
  },
})
