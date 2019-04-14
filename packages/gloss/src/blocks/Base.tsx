import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss, GlossProps } from '../gloss'
import {
  AlphaColorProps,
  alphaColorTheme,
  propStyleTheme,
  PseudoStyleProps,
  psuedoStylePropsTheme,
} from '../themes'
import { TextSizeProps, textSizeTheme } from '../themes/textSizeTheme'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// TODO this should be a "disjoint" type, avoid overlapping!
export type BaseProps = GlossProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'> &
    CSSPropertySetStrict &
    PseudoStyleProps &
    TextSizeProps &
    AlphaColorProps
>

export const Base = gloss<BaseProps>().theme(
  // <Base color="red" /> style props
  propStyleTheme,
  // <Base hoverStyle={{ color: 'red' }} />, focusStyle, activeStyle
  psuedoStylePropsTheme,
  // <Base size={1} /> for text sizing
  textSizeTheme,
  // <Base alpha={0.5} /> for text opacity
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
