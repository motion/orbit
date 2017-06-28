// @flow
import React from 'react'
import { color, view } from '@mcro/black'
import type { Color } from 'gloss'

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

  static theme = {
    theme: ({ color, background }: Props, theme) => ({
      outer: {
        background:
          background || color(theme.base.backgroundColor).darken(1).toString(),
      },
      inner: {
        background: color || theme.base.highlightColor,
      },
    }),
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
}
