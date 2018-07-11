import * as React from 'react'
import { view } from '@mcro/black'
import { Surface } from './surface'
import { Text } from './text'
import { Icon } from './Icon'
import { Color } from '@mcro/css'

type Props = {
  background?: Color
  color?: Color
  children?: string | Object
  icon?: string
  borderRadius?: number
  className?: string
  attach?: Object
  iconProps?: Object
  label?: string | HTMLElement
  labelBefore?: boolean
  fontSize?: number
  style?: Object
}

@view.ui
export class Badge extends React.Component<Props> {
  static defaultProps = {
    background: [0, 0, 0, 0.1],
    borderRadius: 30,
    fontSize: 12,
  }

  render() {
    const {
      label,
      children,
      color,
      icon,
      iconProps,
      attach,
      className,
      style,
      labelBefore,
      fontSize,
      ...props
    } = this.props
    const fontSizeNum = +fontSize

    return (
      <Surface
        $badge
        className={className}
        css={props}
        style={style}
        {...attach}
      >
        <div $content $labelBefore={labelBefore} if={icon || children || label}>
          <div $lbl if={label} $hasChildren={!!children}>
            <Text
              fontSize={fontSizeNum}
              lineHeight={fontSizeNum + 1}
              color={color}
            >
              {label}
            </Text>
          </div>
          <Icon if={icon} size={16} name={icon} color={color} {...iconProps} />
          <div $inner if={children} $hasLabel={!!label}>
            <Text
              fontSize={fontSizeNum}
              lineHeight={fontSizeNum + 1}
              color={color}
            >
              {children}
            </Text>
          </div>
        </div>
      </Surface>
    )
  }

  static style = {
    badge: {
      height: 18,
      padding: [2, 3],
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
      padding: [0, 4],
    },
    hasLabel: {
      paddingLeft: 4,
    },
    lbl: {
      padding: [2, 4],
    },
    hasChildren: {
      paddingRight: 4,
    },
  }
}
