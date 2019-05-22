import { useTheme } from 'gloss'
import * as UI from '@o/ui'
import { IconProps, View } from '@o/ui'
import React, { memo, forwardRef } from 'react'
import { useAppIcon } from '../hooks/useAppIcon'
import { AppIconInner } from './AppIcon'
import { appIcons } from './icons'

export const Icon = memo(
  forwardRef(function Icon(props: IconProps & { svg?: string }, ref) {
    const { name, color, size = 32, style, opacity, ...restProps } = props
    const theme = useTheme()
    const finalColor = color || theme.color ? theme.color.toString() : '#fff'

    // image based source icons
    const appIcon = useAppIcon(props)

    if (appIcon) {
      const sizeProps = {
        width: size,
        height: size,
      }
      return (
        <View
          ref={ref}
          display="inline-block"
          textAlign="center"
          justifyContent="center"
          style={style}
          opacity={opacity}
          {...(appIcon ? adjust[name] : adjust.icon)}
          {...sizeProps}
          {...props}
          className={`ui-icon ${props.className || ''}`}
        >
          {appIcon}
        </View>
      )
    }

    if (appIcons[name]) {
      return <AppIconInner {...props} />
    }

    return (
      <UI.PlainIcon
        name={name}
        color={finalColor}
        size={size}
        style={style}
        opacity={opacity}
        {...restProps}
      />
    )
  }),
)

// @ts-ignore
Icon.acceptsProps = {
  icon: true,
  hover: true,
}

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
