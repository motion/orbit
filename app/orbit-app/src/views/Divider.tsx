import * as React from 'react'
import { view } from '@mcro/black'

export const DividerContainer = view({
  pointerEvents: 'all',
  margin: [0, 6],
  padding: 10,
  cursor: 'ns-resize',
  zIndex: 10,
})

DividerContainer.theme = ({ height }) => ({
  height: height || 1,
})

export const BarInner = view({
  flex: 1,
  borderRadius: 100,
})

BarInner.theme = ({ theme }) => ({
  '& .bar': {
    background: theme.hover.background,
  },
})

export const Divider = ({ children = '', ...props }) => (
  <DividerContainer {...props}>
    <BarInner>{children}</BarInner>
  </DividerContainer>
)
