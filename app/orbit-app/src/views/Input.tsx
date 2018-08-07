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
  background: [255, 255, 255, 0.1],
})

Input.theme = ({ theme }) => ({
  border: [1, theme.base.borderColor.desaturate(0.1)],
  '&:focus-within': {
    boxShadow: [[0, 0, 0, 2, theme.base.borderColor.alpha(0.5)]],
  },
})

Input.defaultProps = {
  tagName: 'input',
}
