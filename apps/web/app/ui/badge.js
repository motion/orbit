// @flow
import React from 'react'
import { view } from '@jot/black'
import type { Color } from 'gloss'
import Icon from './icon'

type Props = {
  background?: Color,
  color?: Color,
  children?: string | Object,
  icon?: string,
  borderRadius?: number,
  className?: string,
  attach?: Object,
  iconProps?: Object,
  label?: string | HTMLElement,
}

@view.ui
export default class Badge {
  props: Props

  static defaultProps = {
    background: [0, 0, 0, 0.1],
    color: '#666',
    borderRadius: 30,
  }

  render({
    label,
    children,
    color,
    icon,
    iconProps,
    attach,
    className,
    ...props
  }: Props) {
    return (
      <badge className={className} $$style={props} $$color={color} {...attach}>
        <content if={icon || children || label}>
          <lbl if={label} $hasChildren={!!children}>{label}</lbl>
          <Icon if={icon} size={16} name={icon} color={color} {...iconProps} />
          <inner if={children} $hasLabel={!!label}>{children}</inner>
        </content>
      </badge>
    )
  }

  static style = {
    badge: {
      lineHeight: '1rem',
      fontSize: 12,
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    content: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    inner: {
      display: 'block',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      margin: 'auto',
      textAlign: 'center',
      fontWeight: 500,
      padding: [0, 6],
    },
    hasLabel: {
      paddingLeft: 4,
    },
    lbl: {
      background: [255, 255, 255, 0.1],
      padding: [0, 6],
    },
    hasChildren: {
      paddingRight: 4,
    },
  }

  static theme = {
    size: ({ size }) => ({
      badge: {
        width: size,
        height: size,
      },
    }),
  }
}
