// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'

export type Props = {
  size: number,
  towards: 'top' | 'right' | 'bottom' | 'left',
  color?: Color,
  boxShadow?: string,
  theme?: string | Object,
  boxShadow?: any,
  background?: any,
}

@view.ui
export default class Arrow extends React.Component<> {
  static defaultProps = {
    size: 16,
    towards: 'bottom',
  }

  getRotation = (towards: string) => {
    switch (towards) {
      case 'left':
        return '-90deg'
      case 'right':
        return '0deg'
    }
    return '0deg'
  }

  getOuterRotation = (towards: string) => {
    switch (towards) {
      case 'right':
        return '90deg'
      case 'bottom':
        return '0deg'
    }
  }

  render({ size, towards, theme, boxShadow, color, opacity, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    // add padding so big shadows work
    return (
      <arrowContain {...props}>
        <arrowOuter
          css={{ transform: { rotate: this.getOuterRotation(towards) } }}
          style={{
            width: size,
            height: size,
          }}
        >
          <arrow
            css={{
              transform: { rotate: this.getRotation(towards) },
            }}
          >
            <arrowInner
              style={{
                top: innerTop * 0.75,
                width: size,
                height: size,
              }}
            />
          </arrow>
        </arrowOuter>
      </arrowContain>
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
  }

  static theme = ({ size, color, boxShadow, opacity, background }, theme) => ({
    arrowInner: {
      background: background || theme.base.background,
      boxShadow,
      opacity,
    },
    arrow: {
      width: size,
      height: size,
    },
  })
}
