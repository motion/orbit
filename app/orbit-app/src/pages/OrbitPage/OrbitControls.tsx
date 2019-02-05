import { gloss, Row } from '@mcro/gloss'
import { BorderBottom } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { HorizontalScroll } from '../../views'

const height = 32

export default observer(function OrbitControls() {
  const toolbars = useOrbitToolbars()

  if (!toolbars) {
    return null
  }

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

  return (
    <ToolbarChrome>
      <ToolbarInner hasToolbars={!!toolbars}>
        {toolbars.children || getFormattedToolbars()}
        <BorderBottom opacity={0.5} />
      </ToolbarInner>
    </ToolbarChrome>
  )
})

const ToolbarSpace = gloss({
  width: 30,
})

const ToolbarChrome = gloss(Row, {
  minHeight: 3,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.tabBackgroundBottom,
  // background: linearGradient(theme.tabBackgroundBottom, theme.background),
  // boxShadow: [
  //   ['inset', 0, 0.5, 0, 0, theme.tabBorderColor || theme.borderColor],
  //   // ['inset', 0, -0.5, 0, 0, theme.borderColor],
  // ],
  // borderBottom: [1, theme.borderColor.alpha(0.2)],
}))

const ToolbarInner = gloss({
  flex: 1,
  flexFlow: 'row',
  hasToolbars: {
    height,
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
