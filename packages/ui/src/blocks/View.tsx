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

View.ignoreAttrs = ['style', ...Object.keys(cleanerDOMIgnore).filter(Boolean)]
