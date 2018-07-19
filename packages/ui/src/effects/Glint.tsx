import { view } from '@mcro/black'

const isUndef = x => typeof x === 'undefined'

// type Props = {
//   color: Color,
//   size: number,
//   borderRadius?: number,
//   borderLeftRadius?: number,
//   borderRightRadius?: number,
//   attach?: Object,
//   top?: number,
//   bottom?: number,
// }

export const Glint = view({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 10,
  zIndex: 10000,
})

Glint.defaultProps = {
  color: [255, 255, 255, 0.09],
  size: 1,
}

Glint.theme = ({
  borderRadius,
  bottom,
  borderRightRadius,
  borderLeftRadius,
  color,
  size,
  ...props
}) => {
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
    top: 0,
    height: '100%',
    transform: { y: 0.5 * (bottom ? 1 : -1), z: 0 },
    borderTop: isUndef(bottom) && [size, color],
    borderBottom: !isUndef(bottom) && [size, color],
    // retina border
    ...radiusStyle,
    ...rightRadiusStyle,
    ...leftRadiusStyle,
    ...props,
  }
}
