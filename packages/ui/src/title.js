// @flow
import React from 'react'
import { color, view } from '@mcro/black'
import Button from './button'
import type { Color } from '@mcro/gloss'

export type TitleProps = {
  tag: string,
  children: React$Children,
  collapsable?: boolean,
  collapsed?: boolean,
  transparent?: boolean,
  before?: React$Children,
  after?: React$Children,
  sub?: boolean,
  hoverable?: React$Children,
  background?: Color,
  stat?: React$Children,
  color?: Color,
  borderColor?: Color,
  onDoubleClick?: Function,
  onCollapse?: Function,
}

@view.ui
export default class Title {
  props: TitleProps

  static defaultProps = {
    tag: 'h1',
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
    children,
    collapsable,
    collapsed,
    before,
    after,
    sub,
    hoverable,
    background,
    stat,
    borderColor,
    color,
    tag: _tag,
    onCollapse,
    transparent,
    ...props
  }: TitleProps) {
    let tag = _tag

    // auto downgrade tag for sub
    if (sub && tag === 'h1') {
      tag = 'h2'
    }

    const titleTag = this.glossElement(tag, { $tag: true }, [
      children,
      <stat if={stat}>{stat}</stat>,
    ])

    return (
      <ptitle {...props} onDoubleClick={this.onDoubleClick}>
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
        <before if={before}>{before}</before>
        {titleTag}
        <after if={after}>{after}</after>
        {/* bugfix: having onDoubleClick here as well forces this to trigger when toggling fast */}
      </ptitle>
    )
  }

  static style = {
    ptitle: {
      padding: [2, 10],
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      cursor: 'default',
    },
    tag: {
      flex: 1,
      flexFlow: 'row',
      userSelect: 'none',
      alignItems: 'center',
      fontSize: 12,
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

  static theme = (props, theme) => {
    const transparentColor = props.transparent ? 'transparent' : false
    const reduce = 1 / +props.tag.slice(1)
    const fontSize = +props.size || 20 + reduce * 20

    return {
      ptitle: {
        fontSize,
        lineHeight: `${1 + fontSize * 0.06}rem`,
        background:
          transparentColor || props.background || theme.base.background,
        borderBottom: !props.sub && [
          1,
          transparentColor ||
            props.borderColor ||
            color ||
            theme.base.borderColor,
        ],
        color: color || theme.base.color,
        '&:hover': {
          color: props.tag === 'a' ? 'red' : 'auto',
          background: props.hoverable
            ? color(props.background).lighten(0.025)
            : props.background,
        },
      },
    }
  }
}
