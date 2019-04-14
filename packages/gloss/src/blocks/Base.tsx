import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import {
  AlphaColorProps,
  alphaColorTheme,
  PseudoStyleProps,
  psuedoStylePropsTheme,
} from '../themes'
import { TextSizeProps, textSizeTheme } from '../themes/textSizeTheme'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// TODO this should be a "disjoint" type, avoid overlapping!
export type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'> &
  CSSPropertySetStrict &
  PseudoStyleProps &
  TextSizeProps &
  AlphaColorProps

export const Base = gloss<BaseProps>().theme(
  // hoverStyle, focusStyle, activeStyle
  psuedoStylePropsTheme,
  // text size helper
  textSizeTheme,
  // alpha colors
  alphaColorTheme,
)

// ignore all valid css props, except src for images
Base.ignoreAttrs = {
  ...validCSSAttr,
  width: true,
  height: true,
  size: true,
  src: false,
}
