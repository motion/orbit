import { baseIgnoreAttrs, gloss } from '../gloss'
import { AlphaColorProps, alphaColorThemeLoose, propsToStyles, PseudoStyleProps, psuedoStylePropsTheme } from '../themes'
import { TextSizeProps } from '../themes/textSizeTheme'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export const Box = gloss({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  flexShrink: 0,
  minWidth: 0,
})

export type BaseProps = PseudoStyleProps & TextSizeProps & AlphaColorProps

export const Base = gloss<BaseProps>(Box).theme(
  // <Base color="red" /> css props
  propsToStyles,
  // <Base hoverStyle={{ color: 'red' }} />, focusStyle, activeStyle
  psuedoStylePropsTheme,
  // <Base alpha={0.5} /> for text opacity
  alphaColorThemeLoose,
)

// ignore all valid css props, except src for images
Base.ignoreAttrs = baseIgnoreAttrs
