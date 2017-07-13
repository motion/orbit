// @flow
import React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'

export type Props = {
  size: number,
  towards: 'top' | 'right' | 'bottom' | 'left',
  color?: Color,
  boxShadow?: string,
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

  render({ size, towards, theme, boxShadow, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    // add padding so big shadows work
    return (
      <arrowOuter
        style={{
          width: size + 40,
          height: size,
          paddingRight: 20,
          paddingLeft: 20,
          marginLeft: -20,
          marginRight: -20,
        }}
      >
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

  static theme = ({ size, background, boxShadow }, theme) => ({
    arrowInner: {
      background:
        background === true
          ? theme.base.background
          : background || theme.base.background,
      boxShadow: boxShadow,
    },
    arrow: {
      width: size,
      height: size,
    },
  })
}
