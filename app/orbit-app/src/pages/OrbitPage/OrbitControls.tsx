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
  minHeight: 4,
  alignItems: 'center',
  justifyContent: 'center',
}).theme((_, theme) => ({
  background: theme.tabBackground,
  boxShadow: [
    ['inset', 0, 0.5, 0, 0, theme.borderColor],
    ['inset', 0, -0.5, 0, 0, theme.borderColor],
  ],
  // borderBottom: [1, theme.borderColor.alpha(0.2)],
}))

const ToolbarInner = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  maxWidth: 820,
  width: '75%',
  minWidth: 400,
  hasToolbars: {
    height: 32,
    padding: [0, 10],
  },
})
