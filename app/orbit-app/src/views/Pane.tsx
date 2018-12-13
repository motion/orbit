import { view } from '@mcro/black'
import { View } from '@mcro/ui'

export const Pane = view(View, {
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  isShown: {
    flex: 1,
    height: 'auto',
    opacity: 1,
    pointerEvents: 'inherit',
  },
})
