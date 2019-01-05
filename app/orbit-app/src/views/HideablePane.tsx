import * as UI from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const HideablePane = gloss(UI.FullScreen, {
  opacity: 1,
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
