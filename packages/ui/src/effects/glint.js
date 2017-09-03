// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'

const isUndef = x => typeof x === 'undefined'

type Props = {
  color: Color,
  size: number,
  borderRadius?: number,
  borderLeftRadius?: number,
  borderRightRadius?: number,
  attach?: Object,
  top?: number,
  bottom?: number,
}

@view.ui
export default class Glint extends React.PureComponent<Props> {
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
      zIndex: 10000,
    },
  }

  static theme = ({
    borderRadius,
    bottom,
    borderRightRadius,
    borderLeftRadius,
    top,
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
      glint: {
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
      },
    }
  }
}
