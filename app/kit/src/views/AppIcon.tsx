import { AppBit } from '@o/models'
import { IconProps, IconShape, SVG, toColor, useTheme } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

export type AppIconProps = Partial<IconProps> & { app: AppBit }

// const idReplace = / id="([a-z0-9-_]+)"/gi

export const AppIcon = memo(
  forwardRef((props: AppIconProps, ref) => {
    const app = props.app
    const theme = useTheme()
    const definition = useAppDefinition(app.identifier)
    const icon = definition.icon
    const isSVGIcon =
      icon
        .trim()
        .slice(0, 20)
        .indexOf('<svg') > -1
    const color = getIconColor(props, theme)

    if (isSVGIcon) {
      const iconSrc = theme.background.isDark()
        ? definition.iconLight || definition.icon
        : definition.icon
      return <SVG fill={color} svg={iconSrc} width={`${props.size}px`} height={`${props.size}px`} />
    }

    return (
      <IconShape
        forwardRef={ref}
        background={app.colors[0]}
        color={app.colors[1]}
        name={app.identifier}
        size={48}
        {...props}
      />
    )
  }),
)

// @ts-ignore
AppIcon.acceptsProps = {
  hover: true,
  icon: true,
}

const getIconColor = (props: AppIconProps, theme: ThemeObject) => {
  let fill
  try {
    fill = toColor(props.color || (props.app && props.app.colors[0]) || theme.color).hex()
  } catch (err) {
    console.debug('error parsing color', err)
    fill = props.color || 'currentColor'
  }
  // translate inherit to currentColor
  fill = fill === 'inherit' ? 'currentColor' : fill
  return `${fill}`
}
