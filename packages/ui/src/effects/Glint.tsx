import { ColorLike } from '@o/color'
import { isDefined } from '@o/utils'
import { gloss, ThemeSelect } from 'gloss'

const isUndef = x => typeof x === 'undefined'

type Props = {
  color?: ColorLike
  size?: number
  borderRadius?: number
  borderLeftRadius?: number
  borderRightRadius?: number
  attach?: Object
  top?: number
  bottom?: number
  y?: number
  opacity?: number
  themeSelect?: ThemeSelect
}

export const Glint = gloss<Props>({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 10,
  zIndex: 10000,
}).theme((props, theme) => {
  const {
    bottom,
    borderLeftRadius,
    borderRadius = 0,
    borderRightRadius,
    opacity,
    size = 1,
    y,
  } = props
  const isTop = isUndef(bottom)
  const themeProp = isTop ? 'glintColor' : 'glintColorBottom'
  let glintColor = props.color || theme[themeProp]
  if (!isDefined(glintColor)) {
    if (isTop) {
      glintColor = theme.glintColor || theme.color
    } else {
      glintColor = theme.backgroundStrong || theme.background.darken(0.1)
    }
  }
  const radiusStyle = {
    ...(borderRadius && {
      borderRadius,
    }),
    ...(borderRightRadius && {
      [isTop ? 'borderTopRightRadius' : 'borderBottomRightRadius']: borderRightRadius,
    }),
    ...(borderLeftRadius && {
      [isTop ? 'borderTopLeftRadius' : 'borderBottomLeftRadius']: borderLeftRadius,
    }),
  }
  const autoHalf = (isTop ? -0.5 : 0.5) * size
  return {
    opacity: typeof theme.glintColor !== 'undefined' ? 1 : opacity,
    [isTop ? 'top' : 'bottom']: 0,
    height: '100%',
    transform: { y: typeof y === 'number' ? y : autoHalf },
    borderTop: isTop && [size, glintColor],
    borderBottom: !isTop && [size, glintColor],
    ...radiusStyle,
  }
})

Glint.defaultProps = {
  className: 'ui-glint',
}
