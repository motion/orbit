// @flow
import React from 'react'
import { view } from '@mcro/black'
import Button from './button'
import type { Color } from '@mcro/gloss'
import $ from 'color'
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

@view.ui
export default class Title extends React.Component {
  props: TitleProps

  static defaultProps = {
    size: 1,
    tagName: 'title',
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
    tagName,
    fontSize,
    fontWeight,
    flex,
    ...props
  }: TitleProps) {
    return (
      <titleroot $$flex={flex} {...props} onDoubleClick={this.onDoubleClick}>
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
              color: $(color).alpha(0.5).toString() || [255, 255, 255, 0.3],
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
          $title
          {...{ [`\$size${Math.floor(size * 1.8)}`]: true }}
          tagName={tagName}
          size={size * 1.02}
          color={color}
          fontSize={fontSize}
          fontWeight={fontWeight}
          {...textProps}
        >
          <el $$row>
            {children}
            <stat if={stat}>
              {stat}
            </stat>
          </el>
        </Text>
        <after if={after}>
          {after}
        </after>
      </titleroot>
    )
  }

  static style = {
    titleroot: {
      padding: [2, 0],
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      cursor: 'default',
    },
    size1: {
      textTransform: 'uppercase',
    },
    size2: {
      fontWeight: 700,
    },
    size3: {
      fontWeight: 200,
    },
    collapse: {
      marginRight: 4,
    },
    title: {
      flexFlow: 'row',
      // display: 'block',
      width: '100%',
    },
    stat: {
      fontSize: 12,
      marginLeft: 8,
      opacity: 0.7,
    },
  }
}
