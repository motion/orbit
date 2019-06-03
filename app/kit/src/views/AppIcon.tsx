import { IconProps, IconShape, SVG, toColor, useTheme } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

type BaseIconProps = Omit<Partial<IconProps>, 'icon' | 'color'>

export type AppIconProps = BaseIconProps & {
  identifier?: string
  icon?: string
  colors?: string[]
}

export const AppIcon = memo(
  forwardRef((props: AppIconProps, ref) => {
    let icon = props.icon || ''
    let iconLight = ''
    let colors = props.colors || ['black', 'black']
    const definition = useAppDefinition(!!props.identifier && props.identifier)

    if (props.identifier && definition) {
      icon = definition.icon
      iconLight = definition.iconLight
      console.log('definition', !!definition.icon)
    }

    if (!icon) {
      console.warn('no icon for', props, icon)
      icon = 'home'
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
        color={`linear-gradient(${colors[0]}, ${colors[1]})`}
        size={48}
        shape="squircle"
        name={icon}
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
    fill = toColor((props.colors && props.colors[0]) || theme.color).hex()
  } catch (err) {
    console.debug('error parsing color', err)
    fill = 'currentColor'
  }
  // translate inherit to currentColor
  fill = fill === 'inherit' ? 'currentColor' : fill
  return `${fill}`
}
