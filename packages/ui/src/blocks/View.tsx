import { propsToStyles, gloss } from '@mcro/gloss'
import { propsToTextSize } from '../helpers/propsToTextSize'
import { validCSSAttr } from '@mcro/css'

export const View = gloss().theme((props, theme) => ({
  ...propsToStyles(props, theme),
  ...propsToTextSize(props),
}))

// ignore all valid css props, except src for images
View.ignoreAttrs = {
  ...validCSSAttr,
  size: true,
  src: false,
}
