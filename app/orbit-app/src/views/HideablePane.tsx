import { gloss } from '@o/gloss'
import * as UI from '@o/ui'

export const HideablePane = gloss(UI.FullScreen, {
  opacity: 1,
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
