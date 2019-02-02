import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalScroll } from '../../views'

const height = 32

export default observer(function OrbitControls() {
  const { orbitStore } = useStoresSafe()
  const toolbars = useOrbitToolbars()

  return (
    <>
      {!orbitStore.isTorn ? (
        <ToolbarChrome>
          <ToolbarInner hasToolbars={!!toolbars}>
            <ToolbarSide>{toolbars && toolbars.before}</ToolbarSide>
            <ToolbarCenter>
              {toolbars && toolbars.center && (
                <>
                  <ToolbarSpace />
                  <HorizontalScroll height={height}>{toolbars.center}</HorizontalScroll>
                  <ToolbarSpace />
                </>
              )}
            </ToolbarCenter>
            <ToolbarSide atEnd>{toolbars && toolbars.after}</ToolbarSide>
          </ToolbarInner>
        </ToolbarChrome>
      ) : null}
    </>
  )
})

const ToolbarSpace = gloss({
  width: 30,
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
  maxWidth: 920,
  width: '100%',
  minWidth: 400,
  hasToolbars: {
    height,
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
  alignItems: 'center',
  justifyContent: 'center',
})
