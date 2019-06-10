import { Row } from '@o/ui'
import { Col, gloss } from 'gloss'

export const HorizontalScroll = gloss(Row, {
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  alignItems: 'center',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const AppWrapper = gloss(Col, {
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  position: 'relative',
  pointerEvents: 'auto',
})
