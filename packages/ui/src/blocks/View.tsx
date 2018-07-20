import { view } from '@mcro/black'
import { propsToStyles } from '@mcro/gloss'
import { propsToTextSize } from '../helpers/propsToTextSize'
import { validCSSAttr } from '@mcro/css'

export const View = view({})

View.theme = ({ scrollable, ...props }) => {
  return {
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}

const cleanerDOMIgnore = {
  ...validCSSAttr,
  src: false,
}

View.ignoreAttrs = cleanerDOMIgnore

console.log('View.ignoreAttrs', View.ignoreAttrs)
