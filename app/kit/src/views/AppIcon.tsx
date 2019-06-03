import { AppBit } from '@o/models'
import { IconProps, IconShape, SVG, toColor, useTheme } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

export type AppIconProps =
  | Partial<IconProps> & { app: Pick<AppBit, 'identifier' | 'colors'> }
  | Partial<IconProps> & { icon: string; colors: string[] }

// const idReplace = / id="([a-z0-9-_]+)"/gi

export const AppIcon = memo(
  forwardRef((props: AppIconProps, ref) => {
    let icon = ''
    let iconLight = ''
    let colors = []

    if ('icon' in props) {
      icon = props.icon
      colors = props.colors
    } else {
      const definition = useAppDefinition(props.app.identifier)
      icon = definition.icon
      iconLight = definition.iconLight
      colors = props.app.colors
    }

    const theme = useTheme()
    const isSVGIcon =
      icon
        .trim()
        .slice(0, 20)
        .indexOf('<svg') > -1
    const color = getIconColor(props, theme)

    if (isSVGIcon) {
      const iconSrc = theme.background.isDark() ? iconLight || icon : icon
      return <SVG fill={color} svg={iconSrc} width={`${props.size}px`} height={`${props.size}px`} />
    }

    return (
      <IconShape
        ref={ref}
        background={colors[0]}
        color={colors[1]}
        size={48}
        shape="squircle"
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
