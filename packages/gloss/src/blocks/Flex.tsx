import { baseIgnoreAttrs, gloss } from '../gloss'
import { AlphaColorProps, alphaColorTheme, propsToStyles } from '../themes'
import { GlossProps } from '../types'
import { Box } from './Box'

export type FlexPropsBase = AlphaColorProps
export type FlexProps = GlossProps<FlexPropsBase>

export const Flex = gloss<FlexPropsBase>(Box, {
  ignoreAttrs: baseIgnoreAttrs,
}).theme(
  // <Base color="red" /> css props
  propsToStyles,
  // <Base alpha={0.5} /> for text opacity
  alphaColorTheme,
)
