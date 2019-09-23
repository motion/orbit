import { AppBit } from '@o/models'
import { IconShape, IconShapeProps, SVG, toColor, useTheme } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

export type AppIconProps = Omit<IconShapeProps, 'color' | 'gradient'> & {
  // use either the appBit
  app?: AppBit
  // or identifier + icon + colors (can use to override app too)
  identifier?: string
  icon?: string
  colors?: string[]
}

export const AppIcon = memo((props: AppIconProps) => {
  const theme = useTheme({ ignroeCoat: true })
  const { app, ...rest } = props
  let icon = props.icon || props.identifier || ''
  let iconLight = ''
  const colors =
    props.colors ||
    (props.app && props.app.colors) ||
    (theme.background.isDark() ? ['#111', '#000'] : ['#111', '#000'])
  console.log('now', colors, theme.background)
  const identifier = props.identifier || (props.app && props.app.identifier) || ''
  const definition = useAppDefinition(identifier)

  if (identifier && definition) {
    icon = definition.icon || props.identifier || ''
    iconLight = definition.iconLight || ''
  }

  if (!icon) {
    console.debug('no icon for', rest)
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
    return (
      <SVG
        color={color}
        width={`${rest.size}px`}
        height={`${rest.size}px`}
        style={{
          transform: 'translate3d(0.1%, 0.1%, 0.1%)',
        }}
        svg={iconSrc}
      />
    )
  }

  if (typeof icon !== 'string') {
    throw new Error(`Icon isn't a string ${icon}`)
  }

  return <IconShape gradient={colors} size={48} shape="squircle" name={icon} {...rest} />
})

// @ts-ignore
AppIcon.acceptsProps = {
  hover: true,
  icon: true,
}

const getIconColor = (props: AppIconProps, theme: ThemeObject) => {
  let fill
  try {
    fill = toColor((props.colors && props.colors[0]) || theme.color).toHexString()
  } catch (err) {
    console.debug('error parsing color', err)
    fill = 'currentColor'
  }
  // translate inherit to currentColor
  fill = fill === 'inherit' ? 'currentColor' : fill
  return `${fill}`
}
