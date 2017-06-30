// @flow
import React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
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
  labelBefore?: boolean,
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
    style,
    labelBefore,
    ...props
  }: Props) {
    return (
      <badge
        className={className}
        $$style={props}
        $$color={color}
        style={style}
        {...attach}
      >
        <content $labelBefore={labelBefore} if={icon || children || label}>
          <lbl if={label} $hasChildren={!!children}>
            {label}
          </lbl>
          <Icon if={icon} size={16} name={icon} color={color} {...iconProps} />
          <inner if={children} $hasLabel={!!label}>
            {children}
          </inner>
        </content>
      </badge>
    )
  }

  static style = {
    badge: {
      lineHeight: '0px',
      fontSize: 12,
      flexFlow: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginRight: 5,
    },
    content: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    labelBefore: {
      flexDirection: 'row-reverse',
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
      padding: [2, 6],
    },
    hasChildren: {
      paddingRight: 4,
    },
  }
}
