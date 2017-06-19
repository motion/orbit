// @flow
import React from 'react'
import { view } from '@jot/black'
import Button from './button'
import { clr } from '~/helpers'
import type { Color } from 'gloss'

export type TitleProps = {
  tag: string,
  children: React$Children,
  collapsable?: boolean,
  collapsed?: boolean,
  before?: React$Children,
  after?: React$Children,
  sub?: boolean,
  hoverable?: React$Children,
  background?: Color,
  stat?: React$Children,
  color?: Color,
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
    color,
    tag: _tag,
    onCollapse,
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
              color: clr(color).alpha(0.5).toString() || [255, 255, 255, 0.3],
            }}
            chromeless
            padding={6}
            margin={[-2, -2, -2, -5]}
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
      fontWeight: 700,
    },
    collapse: {
      marginRight: 5,
      marginLeft: -5,
    },
    stat: {
      fontSize: 11,
      marginLeft: 5,
      opacity: 0.3,
    },
  }

  static theme = {
    theme: ({ color, background, hoverable, sub }, context, theme) => ({
      ptitle: {
        background: background || theme.base.background,
        borderBottom: !sub && [1, color || theme.base.borderColor],
        color: color || theme.base.color,

        '&:hover': {
          background: hoverable ? clr(background).lighten(0.025) : background,
        },
      },
    }),
    tag: ({ tag, size }) => {
      const reduce = 1 / +tag.slice(1)
      const fontSize = +size || 20 + reduce * 20
      return {
        title: {
          fontSize,
          lineHeight: `${1 + fontSize * 0.06}rem`,

          '&:hover': {
            color: tag === 'a' ? 'red' : 'auto',
          },
        },
      }
    },
    sub: {
      ptitle: {
        fontWeight: 300,
        opacity: 0.8,
      },
    },
  }
}
