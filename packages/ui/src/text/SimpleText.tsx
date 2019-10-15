import { AlphaColorProps, alphaColorTheme, Box, gloss, GlossProps, propsToStyles, TextSizeProps } from 'gloss'

import { Size } from '../Space'
import { textSizeTheme } from './textSizeTheme'

type SimpleTextPropsBase = Omit<TextSizeProps, 'size'> &
  AlphaColorProps & {
    size?: Size
    ellipse?: boolean
    selectable?: boolean
  }

export type SimpleTextProps = GlossProps<SimpleTextPropsBase>

export const SimpleText = gloss<SimpleTextPropsBase>(Box, {
  applyPsuedoColors: 'only-if-defined',
  display: 'inline-block',
  whiteSpace: 'normal',
  conditional: {
    ellipse: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    selectable: {
      userSelect: 'text',
    },
    pointable: {
      cursor: 'pointer',
    },
  },
}).theme(propsToStyles, alphaColorTheme, textSizeTheme)
