import React from 'react'
import { view } from '@jot/black'
import { clr } from '~/helpers'
import Button from './button'
import Grain from './grain'
import type { Color } from 'gloss'

export type TitleProps = {
  children: React$Children,
  collapsable?: boolean,
  collapsed?: boolean,
  onCollapse: ?Function,
  before?: React$Children,
  after?: React$Children,
  sub?: boolean,
  hoverable?: React$Children,
  background?: Color,
  stat?: React$Children,
}

@view.ui
export class Title {
  props: TitleProps

  // stop propagation so it doesn't include the click in the dblclick
  onClick = e => {
    const { onCollapse } = this.props
    e.stopPropagation()
    onCollapse(e)
  }

  render({
    children,
    collapsable,
    collapsed,
    onCollapse,
    before,
    after,
    sub,
    hoverable,
    background,
    stat,
    ...props
  }: TitleProps) {
    return (
      <ptitle onDoubleClick={onCollapse} {...props}>
        <collapse
          if={collapsable}
          onClick={this.onClick}
          onDoubleClick={this.onClick}
        >
          <Button
            icon={collapsed ? 'arrow-bold-right' : 'arrow-bold-down'}
            iconProps={{ size: 8, color: [255, 255, 255, 0.3] }}
            chromeless
            padding={6}
            margin={[-2, -2, -2, -5]}
            height="auto"
          />
        </collapse>
        <before if={before}>{before}</before>
        <content>
          {children} <stat if={stat}>{stat}</stat>
        </content>
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
      fontSize: 12,
      fontWeight: 700,
      userSelect: 'none',
    },
    content: {
      flex: 1,
      flexFlow: 'row',
      pointerEvents: 'none',
      alignItems: 'center',
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
    sub: {
      ptitle: {
        fontWeight: 300,
        opacity: 0.8,
      },
    },
  }
}

export type Props = {
  title?: string,
  titleProps?: Object,
  children?: React$Children,
  sub?: boolean,
  collabsable: boolean,
  onSetCollapse: Function,
  padding?: number | Array<number>,
  margin?: number | Array<number>,
  maxHeight?: number,
  minHeight?: number,
  height?: number,
  scrollable?: boolean,
}

@view.ui
export default class Pane {
  static Title = Title
  static defaultProps = {
    collapsable: false,
    onSetCollapse: () => {},
  }

  state = {
    collapsed: false,
  }

  componentWillMount() {
    this.setCollapsed(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setCollapsed(nextProps)
  }

  setCollapsed = ({ collapsed }) => {
    this.setState({ collapsed })
  }

  handleCollapse = () => {
    if (this.props.collapsable) {
      const collapsed = !this.state.collapsed
      this.props.onSetCollapse(collapsed)
      this.setState({ collapsed })
    }
  }

  render({
    collapsable,
    title,
    titleProps,
    height,
    children,
    sub,
    maxHeight,
    minHeight,
    onSetCollapse,
    scrollable,
    collapsed: _collapsed,
    padding,
    margin,
    ...props
  }: Props) {
    const { collapsed } = this.state
    const collapseHeight = 27

    return (
      <section
        $height={height}
        $maxHeight={collapsed ? collapseHeight : maxHeight || 'auto'}
        $minHeight={collapsed ? collapseHeight : minHeight}
        {...props}
      >
        <Title
          if={title}
          $noCollapsable={!collapsable}
          collapsable={collapsable}
          collapsed={collapsed}
          onCollapse={this.handleCollapse}
          sub={sub}
          {...titleProps}
        >
          {title}
        </Title>
        <content $hide={collapsed}>
          {children}
        </content>
      </section>
    )
  }

  static style = {
    section: {
      overflow: 'hidden',
    },
    height: height => ({
      flex: 'auto',
      height,
    }),
    maxHeight: maxHeight => ({
      maxHeight,
    }),
    minHeight: minHeight => ({
      minHeight,
    }),
    hide: {
      display: 'none',
    },
    noCollapsable: {
      paddingLeft: 10,
    },
    content: {
      flex: 1,
      position: 'relative',
    },
  }

  static theme = {
    theme: ({ padding, margin, height }, context, theme) => ({
      content: {
        padding: padding === true ? 10 : padding,
        margin: margin === true ? 10 : margin,
      },
    }),
    maxHeight: ({ maxHeight }) => ({
      content: {
        maxHeight: maxHeight,
        overflowY: 'auto',
        flex: 1,
      },
    }),
    scrollable: {
      content: {
        overflowY: 'auto',
      },
    },
  }
}
