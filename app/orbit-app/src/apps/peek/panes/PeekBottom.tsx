import { view } from '@mcro/black'

export const PeekBottom = view({
  margin: [0, -30],
  padding: [0, 30],
  position: 'relative',
  zIndex: 10,
})

PeekBottom.theme = ({ theme }) => ({
  borderTop: [1, theme.base.borderColor.alpha(0.5)],
  background: theme.base.background,
})
