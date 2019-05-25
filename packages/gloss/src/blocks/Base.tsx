import { CSSPropertySetStrict } from '@o/css'

import { baseIgnoreAttrs, gloss, GlossProps } from '../gloss'
import { AlphaColorProps, alphaColorTheme, propStyleTheme, PseudoStyleProps, psuedoStylePropsTheme } from '../themes'
import { TextSizeProps } from '../themes/textSizeTheme'

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
export type BoxProps = GlossProps<CommonHTMLProps & CSSPropertySetStrict>

export const Box = gloss<BoxProps>({
  display: 'flex',
  flexFlow: 'column',
  boxSizing: 'border-box',
  flexShrink: 0,
  minWidth: 0,
})

export type BaseProps = BoxProps & PseudoStyleProps & TextSizeProps & AlphaColorProps

export const Base = gloss<BaseProps>(Box).theme(
  // <Base color="red" /> css props
  propStyleTheme,
  // <Base hoverStyle={{ color: 'red' }} />, focusStyle, activeStyle
  psuedoStylePropsTheme,
  // <Base alpha={0.5} /> for text opacity
  alphaColorTheme,
)

// ignore all valid css props, except src for images
Base.ignoreAttrs = baseIgnoreAttrs
