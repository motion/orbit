// @flow
import React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
import Text from './text'

export type TitleProps = {
  size: number,
  tagName?: string,
  children: React$Children,
  before?: React$Children,
  after?: React$Children,
  sub?: boolean,
  color?: Color,
}

const MAX_SIZES = 4

@view.ui
export default class Placeholder {
  props: TitleProps

  static defaultProps = {
    size: MAX_SIZES,
  }

  render({
    before,
    after,
    sub,
    color,
    size,
    onCollapse,
    tagName: _tagName,
    ...props
  }: TitleProps) {
    const maxedSize = Math.min(MAX_SIZES, size)
    const textSize = Math.max(0.8, maxedSize / 2.2)
    const tagSize = Math.floor(textSize)
    const tagName = _tagName || `h${tagSize}`

    return (
      <titleroot onDoubleClick={this.onDoubleClick}>
        <before if={before}>
          {before}
        </before>
        <Text
          {...{ [`\$size${Math.floor(size)}`]: true }}
          tagName={tagName}
          size={textSize}
          {...props}
        />
        <after if={after}>
          {after}
        </after>
      </titleroot>
    )
  }

  static style = {
    titleroot: {
      padding: [2, 10],
      flexFlow: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
      opacity: 0.7,
      transition: 'opacity 200ms ease-in',
      flex: 1,
      userSelect: 'none',
      cursor: 'default',
      '&:hover': {
        opacity: 1,
      },
    },
    size2: {
      fontWeight: 300,
    },
    size1: {
      textTransform: 'uppercase',
      fontWeight: 300,
      color: [0, 0, 0, 0.3],
    },
    collapse: {
      marginRight: 4,
    },
    stat: {
      fontSize: 11,
      marginLeft: 5,
      opacity: 0.3,
    },
  }
}
