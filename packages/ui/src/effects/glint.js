// @flow
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'

const isUndef = x => typeof x === 'undefined'

type Props = {
  color: Color,
  size: number,
  radius?: number,
  leftRadius?: number,
  rightRadius?: number,
  attach?: Object,
  top?: number,
  bottom?: number,
}

@view.ui
export default class Glint {
  props: Props

  static defaultProps = {
    color: [255, 255, 255, 0.15],
    size: 1,
  }

  render({ className, attach, style }: Props) {
    return <glint className={className} style={style} {...attach} />
  }

  static style = {
    glint: {
      pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      right: 0,
      height: 10,
      zIndex: 10000000000000000000000,
    },
  }

  static theme = ({
    borderRadius,
    bottom,
    rightRadius,
    leftRadius,
    top,
    color,
    size,
    ...props
  }) => {
    const radiusStyle = borderRadius && {
      borderRadius,
    }
    const rightRadiusStyle = rightRadius && {
      [isUndef(bottom)
        ? 'borderTopRightRadius'
        : 'borderBottomRightRadius']: rightRadius,
    }
    const leftRadiusStyle = leftRadius && {
      [isUndef(bottom)
        ? 'borderTopLeftRadius'
        : 'borderBottomLeftRadius']: leftRadius,
    }

    return {
      glint: {
        top: 0,
        height: '100%',
        transform: { y: 0.5 * (bottom ? 1 : -1) },
        borderTop: isUndef(bottom) && [size, color],
        borderBottom: !isUndef(bottom) && [size, color],
        // retina border
        ...radiusStyle,
        ...rightRadiusStyle,
        ...leftRadiusStyle,
        ...props,
      },
    }
  }
}
