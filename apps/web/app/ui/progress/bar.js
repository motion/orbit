import React from 'react'
import { view } from '@jot/black'
import { clr } from '~/helpers'
import type Color from '../types'

@view.ui
export default class ProgressBar {
  props: {
    background: Color,
    color: Color,
    width: number,
    percent: number,
  }

  static defaultProps = {
    width: 90,
  }

  render() {
    const { percent, color, background, width, ...props } = this.props

    return (
      <outer $width={width} {...props}>
        <inner $percent={percent} $color={color} />
      </outer>
    )
  }

  static theme = {
    theme: ({ color, background }, context, theme) => ({
      outer: {
        background:
          background || clr(theme.base.backgroundColor).darken(1).toString(),
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
