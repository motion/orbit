import { CSSPropertySetStrict, validCSSAttr } from '@o/css'

import { gloss, GlossProps } from '../gloss'
import { AlphaColorProps, alphaColorTheme, propStyleTheme, PseudoStyleProps, psuedoStylePropsTheme } from '../themes'
import { TextSizeProps, textSizeTheme } from '../themes/textSizeTheme'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// TODO this gets messy, and is incomplete
// basic desire is to not overlap with CSS props
// and avoid clutter overall
export type CommonHTMLProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | 'title'
  | 'about'
  | 'accessKey'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'autoSave'
  | 'vocab'
  | 'typeof'
  | 'suppressHydrationWarning'
  | 'suppressContentEditableWarning'
  | 'spellCheck'
  | 'security'
  | 'slot'
  | 'results'
  | 'resource'
  | 'prefix'
  | 'property'
  | 'radioGroup'
  | 'contextMenu'
  | 'dir'
  | 'datatype'
  | 'inlist'
  | 'itemID'
  | 'lang'
  | 'is'
  | 'itemScope'
  | 'inputMode'
  | 'color'
>

// TODO this should be a "disjoint" type, avoid overlapping!
export type BaseProps = GlossProps<
  CommonHTMLProps & CSSPropertySetStrict & PseudoStyleProps & TextSizeProps & AlphaColorProps
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
