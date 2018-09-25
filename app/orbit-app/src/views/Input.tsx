import { view } from '@mcro/black'
import { View } from '@mcro/ui'

export const Input = view(View, {
  position: 'relative',
  flexFlow: 'row',
  borderRadius: 7,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  padding: [8, 12],
}).theme(({ theme }) => ({
  color: theme.color,
  background: theme.background.alpha(0.5),
  border: [1, theme.borderColor.desaturate(0.1)],
  '&:focus-within': {
    boxShadow: [[0, 0, 0, 2, theme.borderColor.alpha(0.5)]],
  },
  '&::selection': {
    color: theme.color.lighten(0.1),
    background: theme.background.darken(0.1),
  },
}))

Input.defaultProps = {
  tagName: 'input',
}
