// @flow
import React from 'react'
import { color, view } from '@mcro/black'
import Button from './button'
import type { Color } from '@mcro/gloss'
import Text from './text'

export type TitleProps = {
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

const MAX_SIZES = 4

@view.ui
export default class Title extends React.Component {
  props: TitleProps

  static defaultProps = {
    size: MAX_SIZES,
  }

  onDoubleClick = (event: MouseEvent) => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(event)
    }
    this.onCollapse(event)
  }

  onCollapse = (event: MouseEvent) => {
    if (this.props.collapsable && this.props.onCollapse) {
      this.props.onCollapse(event)
    }
  }

  render({
    collapsable,
    collapsed,
    before,
    after,
    sub,
    stat,
    color,
    size,
    onCollapse,
    textProps,
    children,
    tagName: _tagName,
    ...props
  }: TitleProps) {
    const maxedSize = Math.min(MAX_SIZES, size)
    const textSize = Math.max(0.8, maxedSize / 2.2)
    const tagSize = Math.floor(textSize)
    const tagName = _tagName || `h${tagSize}`

    return (
      <titleroot {...props} onDoubleClick={this.onDoubleClick}>
        {/* bugfix: having onDoubleClick here as well forces this to trigger when toggling fast */}
        <collapse
          if={collapsable}
          onClick={this.onCollapse}
          onDoubleClick={this.onCollapse}
        >
          <Button
            icon={collapsed ? 'arrow-bold-right' : 'arrow-bold-down'}
            iconProps={{
              size: 8,
              color: color(color).alpha(0.5).toString() || [255, 255, 255, 0.3],
            }}
            circular
            chromeless
            padding={8}
            size={1}
            margin={[-2, -2, -2, -7]}
            height="auto"
          />
        </collapse>
        <before if={before}>
          {before}
        </before>
        <Text
          {...{ [`\$size${Math.floor(size)}`]: true }}
          tagName={tagName}
          size={textSize}
          {...textProps}
        >
          {children}
        </Text>
        <stat if={stat}>
          {stat}
        </stat>
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
      userSelect: 'none',
      cursor: 'default',
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
