import { useTheme } from '@o/gloss'
import * as UI from '@o/ui'
import { IconProps, View } from '@o/ui'
import * as React from 'react'
import { useAppIcon } from '../hooks/useAppIcon'
import { AppIconInner } from './AppIcon'
import { appIcons, icons } from './icons'
import { SVG } from './SVG'

export type OrbitIconProps = IconProps & {
  ref?: any
  name: string
  size?: number
  style?: any
}

export const Icon = React.memo((props: OrbitIconProps) => {
  const { name, color, size = 32, style, opacity, ...restProps } = props
  const theme = useTheme()
  const finalColor = color || theme.color ? theme.color.toString() : '#fff'

  // image based source icons
  const sourceIcon = useAppIcon(props)
  if (sourceIcon) {
    const sizeProps = {
      width: size,
      height: size,
    }
    return (
      <View
        className={`icon ${props.className || ''}`}
        display="inline-block"
        textAlign="center"
        justifyContent="center"
        style={style}
        opacity={opacity}
        {...(sourceIcon ? adjust[name] : adjust.icon)}
        {...sizeProps}
        {...props}
      >
        {sourceIcon}
      </View>
    )
  }

  if (appIcons[name]) {
    return <AppIconInner {...props} />
  }

  // find our custom streamline icons...
  const customIcon = icons[name]

  if (!customIcon) {
    return (
      <UI.Icon
        name={name}
        color={finalColor}
        size={size}
        style={style}
        opacity={opacity}
        {...restProps}
      />
    )
  }

  return (
    <View
      {...restProps}
      className={`icon ${props.className || ''}`}
      fill={`${finalColor}`}
      opacity={opacity}
      hoverStyle={{
        ...props.hoverStyle,
        fill: props.hoverStyle ? props.hoverStyle.color : null,
      }}
    >
      <SVG
        className={restProps.className}
        fill="inherit"
        svg={customIcon}
        width={`${size}px`}
        height={`${size}px`}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          width: size,
          height: size,
          ...style,
        }}
        cleanup={[finalColor ? 'fill' : null, 'title', 'desc', 'width', 'height'].filter(Boolean)}
      />
    </View>
  )
})

Icon['acceptsIconProps'] = true

const adjust = {
  icon: {
    transform: {
      x: -7,
      y: 2,
    },
  },
  slack: {
    transform: {
      scale: 0.92,
    },
  },
  gmail: {
    transform: {
      scale: 0.95,
      x: '-1%',
      y: '-1%',
    },
  },
  github: {
    transform: {
      // x: '-1%',
    },
  },
  confluence: {
    transform: {
      // y: '-31%',
      scale: 1.4,
    },
  },
  jira: {
    transform: {
      y: '5%',
      x: '-8%',
      scale: 1.4,
    },
  },
}
