import { view } from '~/helpers'
import type { Color } from 'gloss'

const isUndef = x => typeof x === 'undefined'

@view
export default class Glint {
  props: {
    color: Color,
    size: number,
    radius?: number,
    leftRadius?: number,
    rightRadius?: number,
    attach?: Object,
    top?: number,
    bottom?: number,
  }

  static defaultProps = {
    color: [255, 255, 255, 0.15],
    size: 1,
  }

  render() {
    const {
      color,
      size,
      rightRadius,
      leftRadius,
      radius,
      className,
      attach,
      top,
      bottom,
      ...props
    } = this.props

    const realTop = isUndef(bottom) ? 0 : top
    const borderStyle = {
      [isUndef(bottom) ? '$$borderTop' : '$$borderBottom']: [size, color],
    }

    return (
      <glint
        className={className}
        $$top={realTop}
        $$bottom={bottom}
        $$style={props}
        {...borderStyle}
        {...attach}
      />
    )
  }

  static style = {
    glint: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 10,
      // retina border
      transform: { y: `-0.5px` },
      zIndex: 0,
    },
  }

  static theme = {
    radius: ({ radius, bottom }) => ({
      glint: {
        [isUndef(bottom)
          ? 'borderTopRightRadius'
          : 'borderBottomRightRadius']: radius,
        [isUndef(bottom)
          ? 'borderTopLeftRadius'
          : 'borderBottomLeftRadius']: radius,
      },
    }),
    rightRadius: ({ rightRadius, bottom }) => ({
      glint: {
        [isUndef(bottom)
          ? 'borderTopRightRadius'
          : 'borderBottomRightRadius']: rightRadius,
      },
    }),
    leftRadius: ({ leftRadius, bottom }) => ({
      glint: {
        [isUndef(bottom)
          ? 'borderTopLeftRadius'
          : 'borderBottomLeftRadius']: leftRadius,
      },
    }),
  }
}
