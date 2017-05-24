export Link from './link'
export List from './list'
export Title from './title'
export Modal from './modal'
export Poof from './poof'
export Icon from './icon'
export Input from './input'
export Loading from './loading'
export Grid from './grid'
export Segment from './segment'
export Button from './button'
export Popover from './popover'
export Glow from './glow'
export ContextMenu from './contextMenu'
export Pane from './pane'
export Text from './text'
export Tabs from './tabs'
export Drawer from './drawer'

import React from 'react'
import { $, view } from '~/helpers'
import Icon from './icon'

@view
export class CircleButton {
  render({ icon, iconProps, children, size, ...props }) {
    return (
      <Circle size={size} {...props}>
        <Icon if={icon} name={icon} {...iconProps} />
        <children if={children}>{children}</children>
      </Circle>
    )
  }
  static style = {
    icon: {
      fontSize: 18,
      lineHeight: '1.4rem',
      height: 20,
    },
    children: {
      fontSize: 12,
      height: 7,
      opacity: 0.5,
      lineHeight: '0.6rem',
    },
  }
}

@view
export class Circle {
  static defaultProps = {
    size: 45,
  }
  render({ size, ...props }) {
    return <circle {...props} />
  }
  static style = {
    circle: {
      display: 'flex',
      fontSize: 30,
      borderRadius: 100,
      lineHeight: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      background: '#fafafa',
      color: '#111',
      fontWeight: 400,
      cursor: 'pointer',
      userSelect: 'none',
    },
  }
  static theme = {
    size: ({ size }) => ({
      circle: {
        width: size || 45,
        height: size || 45,
      },
    }),
  }
}

export const Quote = $('blockquote', {
  borderLeft: [2, '#eee'],
  padding: [5, 10],
  margin: 10,
})

export const Date = $('date', {
  color: '#999',
})
