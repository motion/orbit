// @flow
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'

export type Props = {
  size: number,
  towards: 'top' | 'right' | 'bottom' | 'left',
  color?: Color,
  shadow?: string,
}

@view.ui
export default class Arrow {
  props: Props

  static defaultProps = {
    size: 16,
    towards: 'bottom',
  }

  getRotation = towards => {
    switch (towards) {
      case 'left':
        return '-90deg'
      case 'right':
        return '90deg'
    }
    return '0deg'
  }

  render({ size, towards, theme, shadow, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrowOuter style={{ width: size, height: size }}>
        <arrow $rotate={this.getRotation(towards)} {...props}>
          <arrowInner
            style={{
              top: innerTop * 0.75,
              width: size,
              height: size,
            }}
          />
        </arrow>
      </arrowOuter>
    )
  }

  static style = {
    // why arrowOuter and arrow? Because chrome transform rotate destroy overflow: hidden, so we nest one more
    arrowOuter: {
      position: 'relative',
      overflow: 'hidden',
    },
    arrowInner: {
      position: 'absolute',
      left: 0,
      borderRadius: 1,
      transform: 'rotate(45deg)',
    },
    rotate: amount => ({
      transform: {
        rotate: amount,
      },
    }),
  }

  static theme = ({ size, background, shadow }, theme) => ({
    arrowInner: {
      background: background || theme.base.background,
      boxShadow: shadow,
    },
    arrow: {
      width: size,
      height: size,
    },
  })
}
