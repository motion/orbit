import { gloss, Row } from '@mcro/gloss'
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
                <ToolbarSide>{toolbars && toolbars.before}</ToolbarSide>
                <ToolbarCenter>{toolbars && toolbars.center}</ToolbarCenter>
                <ToolbarSide atEnd>{toolbars && toolbars.after}</ToolbarSide>
              </ToolbarInner>
            )}
          </OrbitToolBarRender>
        </ToolbarChrome>
      ) : null}
    </>
  )
})

const ToolbarChrome = gloss(Row, {
  minHeight: 3,
  alignItems: 'center',
  justifyContent: 'center',
}).theme((_, theme) => ({
  background: `linear-gradient(${theme.tabBackground.alpha(0.95)}, ${theme.background})`,
  boxShadow: [
    ['inset', 0, 0.5, 0, 0, theme.tabBorderColor || theme.borderColor],
    // ['inset', 0, -0.5, 0, 0, theme.borderColor],
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

const ToolbarSide = gloss({
  flexFlow: 'row',
  width: '25%',
  maxWidth: 150,
  alignItems: 'center',
  atEnd: {
    justifyContent: 'flex-end',
  },
})

const ToolbarCenter = gloss({
  flexFlow: 'row',
  flex: 2,
  overflowX: 'auto',
  overflowY: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
})
