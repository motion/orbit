// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
import Text from './text'

export type Props = {
  size: number,
  tagName?: string,
  children: React$Children,
  collapsable?: boolean,
  collapsed?: boolean,
  before?: React$Children,
  after?: React$Children,
  sub?: boolean,
  stat?: React$Children,
  color?: Color,
  onDoubleClick?: Function,
  onCollapse?: Function,
}

@view.ui
export default class Title extends React.PureComponent<Props> {
  static defaultProps = {
    size: 1,
    tagName: 'title',
    fontWeight: 200,
  }

  render({ stat, size, children, tagName, ...props }: Props) {
    return (
      <Text
        $title
        display="inline-block"
        {...{ [`\$size${Math.floor(size * 1.8)}`]: true }}
        tagName={tagName}
        size={size}
        {...props}
      >
        {children}
        <stat if={stat}>{stat}</stat>
      </Text>
    )
  }

  static style = {
    size1: {
      fontWeight: 200,
    },
    stat: {
      fontSize: '50%',
      marginLeft: 8,
      opacity: 0.7,
    },
  }
}
