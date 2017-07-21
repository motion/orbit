// @flow
import React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
import Surface from './surface'
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
      <Surface
        $badge
        className={className}
        css={props}
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
      </Surface>
    )
  }

  static style = {
    badge: {
      height: 18,
      padding: [2, 3],
      fontSize: 11.5,
      marginLeft: 5,
      alignSelf: 'center',
      flexFlow: 'row',
      alignItems: 'center',
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
