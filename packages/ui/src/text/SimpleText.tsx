import { Base, BaseProps, getTextSizeTheme, gloss, propsToStyles } from 'gloss'

import { Config } from '../helpers/configureUI'
import { useScale } from '../Scale'
import { getTextSize } from '../Sizes'
import { Size } from '../Space'

export type SimpleTextProps = BaseProps & {
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
}).theme(propsToStyles, scaledTextSizeTheme)

SimpleText.defaultProps = {
  ...Config.defaultProps.text,
  applyPsuedoColors: 'only-if-defined',
}

export function scaledTextSizeTheme(props: any) {
  const scale = useScale()
  const size = getTextSize(props.size) + 0.75
  return getTextSizeTheme(props, { scale, size })
}
