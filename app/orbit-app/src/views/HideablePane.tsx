import { gloss } from '@mcro/gloss'
import * as UI from '@mcro/ui'

export const HideablePane = gloss(UI.FullScreen, {
  opacity: 1,
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
