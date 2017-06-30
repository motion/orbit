// @flow
import React from 'react'
import { view } from '@mcro/black'
import $ from 'color'
import type { Color } from '@mcro/gloss'

type Props = {
  background?: Color,
  color?: Color,
  width: number,
  percent: number | string,
}

@view.ui
export default class ProgressBar {
  props: Props

  static defaultProps = {
    width: 90,
    percent: 0,
  }

  render({ percent, color, background, width, ...props }: Props) {
    return (
      <outer $width={width} {...props}>
        <inner $percent={+percent} $color={color} />
      </outer>
    )
  }

  static style = {
    outer: {
      height: 6,
      margin: ['auto', 5],
      borderRadius: 100,
      justifyContent: 'center',
    },
    inner: {
      height: '100%',
      borderRadius: 100,
    },
    width: width => ({
      minWidth: width,
      width,
    }),
    percent: percent => ({
      width: `${percent}%`,
    }),
  }

  static theme = ({ color, background }: Props, theme) => ({
    outer: {
      background:
        background || theme.base.background
          ? $(theme.base.background).darken(0.5)
          : '#eee',
    },
    inner: {
      background: color || theme.base.highlightColor,
    },
  })
}
