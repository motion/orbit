import { gloss } from '@o/gloss'
import * as React from 'react'
import { View } from './View/View'

export const DividerContainer = gloss<{ padded?: boolean }>(View, {
  pointerEvents: 'inherit',
  zIndex: 10,
  padded: {
    padding: [10, 6],
  },
})

export const BarInner = gloss(View, {
  flex: 1,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(a => a * 0.35),
}))

export function Divider({ background = null, height = 1, ...props }) {
  return (
    <DividerContainer {...props}>
      <BarInner background={background} height={height} />
    </DividerContainer>
  )
}
