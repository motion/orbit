import { gloss } from '@o/gloss'
import * as UI from '@o/ui'
import { Row } from '@o/ui'

export const HorizontalScroll = gloss(Row, {
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  alignItems: 'center',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const AppWrapper = gloss(UI.Col, {
  // background: [0, 0, 0, 0.1],
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  position: 'relative',
  pointerEvents: 'auto',
})
