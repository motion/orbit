import { IconProps, ThemeContext } from '@mcro/ui'
import React, { useContext } from 'react'
import { SVG } from '../views/SVG'
import { useAppPackage } from './useAppPackage'

export function useSourceIcon(props: IconProps) {
  const { name } = props
  const { activeTheme } = useContext(ThemeContext)
  const appDefinition = useAppPackage(props.name)
  if (!name) return null
  if (!appDefinition) return null
  const extImg = name && (name[0] === '/' || name.indexOf('http') === 0) ? name : null
  let iconImg = extImg
  if (appDefinition) {
    const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
    iconImg = isDark
      ? appDefinition.app.iconLight || appDefinition.app.icon
      : appDefinition.app.icon
  }
  if (iconImg) {
    return <SVG svg={iconImg} cleanup={['width', 'height']} {...props} />
  }
  return null
}
