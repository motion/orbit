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
})

Input.theme = ({ theme }) => ({
  color: theme.base.color,
  background: theme.base.background,
  border: [1, theme.base.borderColor.desaturate(0.1)],
  '&:focus-within': {
    boxShadow: [[0, 0, 0, 2, theme.base.borderColor.alpha(0.5)]],
  },
  '&::selection': {
    color: '#fff',
    background: 'red',
  },
})

Input.defaultProps = {
  tagName: 'input',
}
