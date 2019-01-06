import * as React from 'react'
import { gloss } from '@mcro/gloss'

export const DividerContainer = gloss({
  pointerEvents: 'all',
  padding: [10, 6],
  zIndex: 10,
})

export const BarInner = gloss({
  flex: 1,
  height: 1,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(0.35),
}))

export const Divider = props => (
  <DividerContainer {...props}>
    <BarInner />
  </DividerContainer>
)
