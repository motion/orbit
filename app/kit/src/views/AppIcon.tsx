import { IconShape, IconShapeProps, SVG, toColor, useTheme } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

export type AppIconProps = Omit<IconShapeProps, 'color' | 'gradient'> & {
  identifier?: string
  icon?: string
  colors?: string[]
}

export const AppIcon = memo(
  forwardRef((props: AppIconProps, ref) => {
    const theme = useTheme({ ignoreAlternate: true })
    let icon = props.icon || props.identifier || ''
    let iconLight = ''
    let colors = props.colors || [theme.color, theme.colorBlur].map(x => `${x}`)

    const identifier = typeof props.identifier === 'string' ? props.identifier : false
    const definition = useAppDefinition(identifier)

    if (identifier && definition) {
      icon = definition.icon || props.identifier || ''
      iconLight = definition.iconLight || ''
    }

    if (!icon) {
      console.debug('no icon for', props)
      icon = 'home'
    }

    const isSVGIcon =
      icon
        .slice(0, 20)
        .trim()
        .indexOf('<svg') > -1
    const color = getIconColor(props, theme)

    if (isSVGIcon) {
      const iconSrc = theme.background.isDark() ? iconLight || icon : icon
      return <SVG fill={color} svg={iconSrc} width={`${props.size}px`} height={`${props.size}px`} />
    }

    return (
      <IconShape ref={ref} gradient={colors} size={48} shape="squircle" name={icon} {...props} />
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
