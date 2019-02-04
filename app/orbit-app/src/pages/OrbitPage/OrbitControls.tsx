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

  return (
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
      <BorderBottom opacity={0.5} />
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
  // background: linearGradient('transparent', theme.background.darken(0.05)),
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
    padding: [0, 10],
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
