import { gloss, Row, SimpleText } from '@mcro/gloss'
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
              <SimpleText alpha={0.8} fontWeight={500}>
                <ToolbarInner hasToolbars={!!toolbars}>
                  <ToolbarSide>{toolbars && toolbars.before}</ToolbarSide>
                  <ToolbarCenter>{toolbars && toolbars.center}</ToolbarCenter>
                  <ToolbarSide end>{toolbars && toolbars.after}</ToolbarSide>
                </ToolbarInner>
              </SimpleText>
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

const ToolbarSide = gloss({
  flexFlow: 'row',
  width: '25%',
  maxWidth: 150,
  alignItems: 'center',
  end: {
    justifyContent: 'flex-end',
  },
})

const ToolbarCenter = gloss({
  flexFlow: 'row',
  flex: 2,
  overflowX: 'scroll',
  overflowY: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
})
