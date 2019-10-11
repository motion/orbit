import { Base, gloss, propsToStyles } from 'gloss'

import { getSize } from './Sizes'
import { Size } from './Space'
import { scaledTextSizeTheme } from './text/scaledTextSizeTheme'

export const Circle = gloss<{ size?: Size }>(Base, {
  size: 'md',
  position: 'relative',
  borderRadius: 100000,
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
}).theme(
  props => ({
    width: getSize(props.size) * 36,
    height: getSize(props.size) * 36,
    background: props.backgroundStrong,
    borderRadius: props.size,
  }),
  propsToStyles,
  scaledTextSizeTheme,
)
