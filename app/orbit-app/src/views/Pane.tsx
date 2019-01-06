import { View } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const Pane = gloss(View, {
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
