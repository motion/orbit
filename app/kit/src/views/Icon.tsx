import * as UI from '@mcro/ui'
import { IconProps, ThemeContext, View } from '@mcro/ui'
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
  const { activeTheme } = React.useContext(ThemeContext)
  const finalColor = color || activeTheme.color.toString()

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
  const icon = icons[name]

  // ...or fallback to @mcro/ui icon
  if (!icon) {
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
    <View {...restProps}>
      <SVG
        className={restProps.className}
        fill={`${finalColor}`}
        svg={icon}
        width={`${size}`}
        height={`${size}`}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          width: size,
          height: size,
          opacity,
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
