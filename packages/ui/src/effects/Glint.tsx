import { view } from '@mcro/black'
import { Color } from '@mcro/css'
import { ThemeObject } from '@mcro/gloss'

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
  theme?: ThemeObject
}

export const Glint = view({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 10,
  zIndex: 10000,
}).theme((props: Props) => {
  const radiusStyle = {
    ...(props.borderRadius && {
      borderRadius: props.borderRadius,
    }),
    ...(props.borderRightRadius && {
      [isUndef(props.bottom)
        ? 'borderTopRightRadius'
        : 'borderBottomRightRadius']: props.borderRightRadius,
    }),
    ...(props.borderLeftRadius && {
      [isUndef(props.bottom)
        ? 'borderTopLeftRadius'
        : 'borderBottomLeftRadius']: props.borderLeftRadius,
    }),
  }
  return {
    opacity: props.opacity,
    top: 0,
    height: '100%',
    transform: { y: props.y * (props.bottom ? 1 : -1), z: 0 },
    borderTop: isUndef(props.bottom) && [props.size, props.theme.glintColor || props.color],
    borderBottom: !isUndef(props.bottom) && [props.size, props.theme.glintColor || props.color],
    ...radiusStyle,
  }
})
