import * as React from 'react'
import { view } from '@mcro/black'

export const OrbitDividerContainer = view({
  pointerEvents: 'all',
  margin: [0, 6],
  padding: 10,
  cursor: 'ns-resize',
  zIndex: 10,
})

OrbitDividerContainer.theme = ({ height }) => ({
  height: height || 1,
})

export const OrbitBarInner = view({
  flex: 1,
  borderRadius: 100,
})

OrbitBarInner.theme = ({ theme }) => ({
  '& .bar': {
    background: theme.hover.background,
  },
})

export const OrbitDivider = ({ children = '', ...props }) => (
  <OrbitDividerContainer {...props}>
    <OrbitBarInner>{children}</OrbitBarInner>
  </OrbitDividerContainer>
)
