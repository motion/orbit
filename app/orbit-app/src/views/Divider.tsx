import * as React from 'react'
import { view } from '@mcro/black'

export const DividerContainer = view({
  pointerEvents: 'all',
  padding: [10, 6],
  zIndex: 10,
})

export const BarInner = view({
  flex: 1,
  height: 1,
  borderRadius: 100,
})

BarInner.theme = ({ theme }) => ({
  background: theme.borderColor,
})

export const Divider = props => (
  <DividerContainer {...props}>
    <BarInner />
  </DividerContainer>
)
