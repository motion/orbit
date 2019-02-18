import { gloss } from '@mcro/gloss'
import { View } from '@mcro/ui'

export const Pane = gloss(View, {
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  isShown: {
    flex: 1,
    height: 'auto',
    opacity: 1,
    pointerEvents: 'inherit',
  },
})
