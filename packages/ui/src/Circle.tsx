import { Base, gloss, propsToStyles } from 'gloss'

import { getSize } from './Sizes'
import { Size } from './Space'
import { scaledTextSizeTheme } from './text/SimpleText'

export const Circle = gloss<{ size?: Size; background?: any }>(Base, {
  position: 'relative',
  borderRadius: 100000,
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
}).theme(
  (p, theme) => ({
    width: getSize(p.size) * 36,
    height: getSize(p.size) * 36,
    background: p.background || theme.backgroundStrong,
    borderRadius: p.size,
  }),
  propsToStyles,
  scaledTextSizeTheme,
)

Circle.defaultProps = {
  size: 'md',
}
