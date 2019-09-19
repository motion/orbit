import { Base, BaseProps, colorTheme, gloss } from 'gloss'

import { Config } from '../helpers/configureUI'
import { Size } from '../Space'
import { scaledTextSizeTheme } from './scaledTextSizeTheme'

export type SimpleTextProps = Partial<Omit<BaseProps, 'size'>> & {
  size?: Size
  ellipse?: boolean
  selectable?: boolean
}

export const SimpleText = gloss<SimpleTextProps>(Base, {
  display: 'inline-block',
  whiteSpace: 'normal',
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
}).theme(colorTheme, scaledTextSizeTheme)

SimpleText.defaultProps = {
  ...Config.defaultProps.text,
  applyPsuedoColors: 'only-if-defined',
}
