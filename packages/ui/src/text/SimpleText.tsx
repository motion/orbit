import { AlphaColorProps, alphaColorTheme, Box, gloss, GlossProps, propsToStyles, TextSizeProps } from 'gloss'

import { Config } from '../helpers/configureUI'
import { Size } from '../Space'
import { scaledTextSizeTheme } from './scaledTextSizeTheme'

type SimpleTextPropsBase = Omit<TextSizeProps, 'size'> &
  AlphaColorProps & {
    size?: Size
    ellipse?: boolean
    selectable?: boolean
  }

export type SimpleTextProps = GlossProps<SimpleTextPropsBase>

export const SimpleText = gloss<SimpleTextPropsBase>(Box, {
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
}).theme(propsToStyles, alphaColorTheme, scaledTextSizeTheme)

SimpleText.defaultProps = {
  ...Config.defaultProps.text,
  applyPsuedoColors: 'only-if-defined',
}
