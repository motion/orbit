import { view } from '@mcro/black'
import { propsToStyles } from '@mcro/gloss'
import { propsToTextSize } from '../helpers/propsToTextSize'
import { validCSSAttr } from '@mcro/css'

export const View = view()

View.theme = ({ scrollable, ...props }) => {
  return {
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}

// ignore all valid css props, except src for images
View.ignoreAttrs = {
  ...validCSSAttr,
  size: true,
  src: false,
}
