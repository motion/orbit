import { gloss, View } from '@mcro/gloss'
import * as React from 'react'

export const DividerContainer = gloss(View, {
  pointerEvents: 'all',
  padding: [10, 6],
  zIndex: 10,
})

export const BarInner = gloss(View, {
  flex: 1,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(0.35),
}))

export function Divider({ background = null, height = 1, ...props }) {
  return (
    <DividerContainer {...props}>
      <BarInner background={background} height={height} />
    </DividerContainer>
  )
}
