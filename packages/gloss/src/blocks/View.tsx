import { CSSPropertySet, CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

// TODO: We should get rid of using CSSPropertySet (move from ViewProps => ViewPropsStrict)
// it causes loose types which make many views wortheless for sanity checks

export type ViewProps = React.HTMLAttributes<HTMLDivElement> & CSSPropertySet

export type ViewPropsStrict = React.HTMLAttributes<HTMLDivElement> & CSSPropertySetStrict

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
