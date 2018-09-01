import { view } from '@mcro/black'
import { Color } from '@mcro/css'

const isUndef = x => typeof x === 'undefined'

type Props = {
  color: Color
  size: number
  borderRadius?: number
  borderLeftRadius?: number
  borderRightRadius?: number
  attach?: Object
  top?: number
  bottom?: number
  y?: number
  opacity?: number
}

export const Glint = view({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 10,
  zIndex: 10000,
})

Glint.theme = ({
  bottom,
  borderLeftRadius,
  borderRadius = 0,
  borderRightRadius,
  opacity = 0.5,
  color = '#fff',
  size = 1,
  y = 0.5,
  ...props
}: Props) => {
  const radiusStyle = borderRadius && {
    borderRadius,
  }
  const rightRadiusStyle = borderRightRadius && {
    [isUndef(bottom)
      ? 'borderTopRightRadius'
      : 'borderBottomRightRadius']: borderRightRadius,
  }
  const leftRadiusStyle = borderLeftRadius && {
    [isUndef(bottom)
      ? 'borderTopLeftRadius'
      : 'borderBottomLeftRadius']: borderLeftRadius,
  }
  return {
    opacity,
    top: 0,
    height: '100%',
    transform: { y: y * (bottom ? 1 : -1), z: 0 },
    borderTop: isUndef(bottom) && [size, color],
    borderBottom: !isUndef(bottom) && [size, color],
    // retina border
    ...radiusStyle,
    ...rightRadiusStyle,
    ...leftRadiusStyle,
    ...props,
  }
}
