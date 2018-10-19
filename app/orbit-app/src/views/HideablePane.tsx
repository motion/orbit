import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

export const HideablePane = view(UI.FullScreen, {
  opacity: 1,
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
