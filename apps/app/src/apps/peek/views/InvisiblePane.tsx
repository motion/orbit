import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

export const InvisiblePane = view(UI.FullScreen, {
  opacity: 0,
  pointerEvents: 'none',
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})
