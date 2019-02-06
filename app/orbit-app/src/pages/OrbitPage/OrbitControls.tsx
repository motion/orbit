import { gloss, Row } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { HorizontalScroll } from '../../views'
import { BorderBottom } from '../../views/Border'

const height = 32

export const OrbitControlsHeight = () => <div style={{ height }} />

export default observer(function OrbitControls() {
  const toolbars = useOrbitToolbars()

  function getFormattedToolbars() {
    return (
      <>
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
      </>
    )
  }

  const hasToolbars = !!toolbars

  return (
    <ToolbarChrome hasToolbars={hasToolbars}>
      <ToolbarInner hasToolbars={hasToolbars}>
        {(toolbars && toolbars.children) || getFormattedToolbars()}
        {hasToolbars && <BorderBottom opacity={0.5} />}
      </ToolbarInner>
    </ToolbarChrome>
  )
})

const ToolbarSpace = gloss({
  width: 30,
})

const ToolbarChrome = gloss(Row, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
}).theme(({ hasToolbars }, theme) => ({
  zIndex: hasToolbars ? 1000 : -1,
  background: hasToolbars ? theme.tabBackgroundBottom || theme.background : 'transparent',
}))

const ToolbarInner = gloss({
  flex: 1,
  flexFlow: 'row',
  height,
  hasToolbars: {
    padding: [0, 12],
  },
})

const ToolbarSide = gloss({
  flexFlow: 'row',
  maxWidth: 150,
  alignItems: 'center',
  atEnd: {
    justifyContent: 'flex-end',
  },
})

const ToolbarCenter = gloss({
  flexFlow: 'row',
  flex: 20,
  alignItems: 'center',
  justifyContent: 'center',
})
