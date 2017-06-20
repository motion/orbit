// @flow
import { view } from '@jot/black'
import type { Color } from 'gloss'

export type Props = {
  size: number,
  towards: 'top' | 'right' | 'bottom' | 'left',
  color?: Color,
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

  render({ size, towards, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrowOuter>
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

  static theme = {
    theme: ({ size, color }, state, theme) => ({
      arrowInner: {
        backgroundColor: color || theme.base.background,
      },
      arrow: {
        width: size,
        height: size,
      },
    }),
  }
}
