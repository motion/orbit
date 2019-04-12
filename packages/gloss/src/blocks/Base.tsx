import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export type GlossBaseProps = {
  tagName?: string
  // our default styling supports is through preProcessTheme
  alt?: string
  // our default styling supports pseudos through propsToStyles
  hoverStyle?: CSSPropertySetStrict | false | null
  activeStyle?: CSSPropertySetStrict | false | null
  focusStyle?: CSSPropertySetStrict | false | null
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// TODO this should be a "disjoint" type, avoid overlapping!
export type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'> &
  CSSPropertySetStrict &
  GlossBaseProps

export const Base = gloss<BaseProps>().theme(
  // hoverStyle, focusStyle, activeStyle
  propsToStyles,
  // text size helper
  propsToTextSize,
)

// ignore all valid css props, except src for images
Base.ignoreAttrs = {
  ...validCSSAttr,
  width: true,
  height: true,
  size: true,
  src: false,
}
