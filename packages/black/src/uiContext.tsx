import { wrapHOC } from '@mcro/decor-react'
import { attachTheme } from '@mcro/gloss'

export const uiContext = [
  wrapHOC,
  {
    wrapper: attachTheme,
  }
]
