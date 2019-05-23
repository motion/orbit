import { IconProps, SVG, ThemeContext } from '@o/ui'
import React, { useContext } from 'react'

import { useAppDefinition } from './useAppDefinition'

export function useAppIcon(props: IconProps) {
  const { name } = props
  const { activeTheme } = useContext(ThemeContext)
  const def = useAppDefinition(name)
  if (!name || !def) return null
  const extImg = name && (name[0] === '/' || name.indexOf('http') === 0) ? name : null
  let iconImg = extImg
  if (def) {
    const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
    iconImg = isDark ? def.iconLight || def.icon : def.icon
  }
  if (iconImg) {
    return <SVG svg={iconImg} cleanup={['width', 'height']} {...props} />
  }
  return null
}
