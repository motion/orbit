import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export type GlossBaseProps = {
  tagName?: string
  // our default styling supports is through preProcessTheme
  alt?: string
  // our default styling supports pseudos through propsToStyles
  hoverStyle?: CSSPropertySetStrict
  activeStyle?: CSSPropertySetStrict
  focusStyle?: CSSPropertySetStrict
}

export type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> &
  CSSPropertySetStrict &
  GlossBaseProps

export const Base = gloss<BaseProps>().theme((props, theme) => ({
  ...propsToStyles(props, theme),
  ...propsToTextSize(props),
}))

// ignore all valid css props, except src for images
Base.ignoreAttrs = {
  ...validCSSAttr,
  width: true,
  height: true,
  size: true,
  src: false,
}
