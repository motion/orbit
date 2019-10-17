import { baseIgnoreAttrs, gloss } from '../gloss'
import { AlphaColorProps, alphaColorTheme, propsToStyles } from '../themes'
import { GlossProps } from '../types'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export const Box = gloss({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  flexShrink: 0,
  minWidth: 0,
})

export type BasePropsBase = AlphaColorProps
export type BaseProps = GlossProps<BasePropsBase>

export const Base = gloss<BasePropsBase>(Box).theme(
  // <Base color="red" /> css props
  propsToStyles,
  // <Base alpha={0.5} /> for text opacity
  alphaColorTheme,
)

// ignore all valid css props, except src for images
Base.ignoreAttrs = baseIgnoreAttrs
