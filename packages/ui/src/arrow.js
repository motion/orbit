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
        return '0deg'
    }
    return '0deg'
  }

  getOuterRotation = towards => {
    switch (towards) {
      case 'right':
        return '90deg'
    }
  }

  render({ size, towards, theme, boxShadow, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    log(towards, innerTop)

    // add padding so big shadows work
    return (
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
          {...props}
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
