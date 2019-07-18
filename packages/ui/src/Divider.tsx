import { gloss } from 'gloss'
import * as React from 'react'

import { Row, RowProps } from './View/Row'
import { View } from './View/View'

export const DividerContainer = gloss(Row, {
  pointerEvents: 'inherit',
  zIndex: 10,
})

export const BarInner = gloss(View, {
  flex: 1,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.borderColor.setAlpha(a => a * 0.35),
}))

export type DividerProps = Partial<RowProps>

export function Divider({ background = null, height = 1, ...props }: DividerProps) {
  return (
    <DividerContainer {...props}>
      <BarInner background={background} height={height} />
    </DividerContainer>
  )
}
