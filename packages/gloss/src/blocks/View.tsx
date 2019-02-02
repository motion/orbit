import { CSSPropertySet, validCSSAttr } from '@mcro/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export type ViewProps = React.HTMLAttributes<HTMLDivElement> & CSSPropertySet

export const View = gloss<ViewProps>().theme((props, theme) => ({
  ...propsToStyles(props, theme),
  ...propsToTextSize(props),
}))

// ignore all valid css props, except src for images
View.ignoreAttrs = {
  ...validCSSAttr,
  size: true,
  src: false,
}
