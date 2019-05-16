import { Base, BaseProps, getTextSizeTheme, gloss } from 'gloss'

import { Config } from '../helpers/configure'
import { useScale } from '../Scale'

export type SimpleTextProps = BaseProps & {
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
}).theme(scaledTextSizeTheme)

SimpleText.defaultProps = {
  ...Config.defaultProps.text,
  applyPsuedoColors: 'only-if-defined',
}

function scaledTextSizeTheme(props: any) {
  const scale = useScale()
  return getTextSizeTheme(props, scale)
}
