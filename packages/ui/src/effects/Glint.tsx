import { Color } from '@o/css'
import { gloss } from '@o/gloss'

const isUndef = x => typeof x === 'undefined'

type Props = {
  color?: Color
  size?: number
  borderRadius?: number
  borderLeftRadius?: number
  borderRightRadius?: number
  attach?: Object
  top?: number
  bottom?: number
  y?: number
  opacity?: number
}

export const Glint = gloss<Props>({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 10,
  zIndex: 10000,
}).theme(
  (
    {
      bottom,
      borderLeftRadius,
      borderRadius = 0,
      borderRightRadius,
      opacity = 0.35,
      color,
      size = 1,
      y,
    },
    theme,
  ) => {
    const radiusStyle = {
      ...(borderRadius && {
        borderRadius,
      }),
      ...(borderRightRadius && {
        [isUndef(bottom) ? 'borderTopRightRadius' : 'borderBottomRightRadius']: borderRightRadius,
      }),
      ...(borderLeftRadius && {
        [isUndef(bottom) ? 'borderTopLeftRadius' : 'borderBottomLeftRadius']: borderLeftRadius,
      }),
    }
    return {
      opacity,
      top: 0,
      height: '100%',
      transform: { y: typeof y === 'number' ? y : bottom ? 0.5 : -0.5 },
      borderTop: isUndef(bottom) && [size, color || theme.glintColor || theme.background],
      borderBottom: !isUndef(bottom) && [size, color || theme.glintColor || theme.background],
      ...radiusStyle,
    }
  },
)
