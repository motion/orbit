import { IconProps, ThemeContext } from '@mcro/ui'
import React, { isValidElement, useContext } from 'react'
import { SVG } from '../views/SVG'
import { useApp } from './useApp'

export function useSourceIcon(props: IconProps) {
  const { name } = props
  const { activeTheme } = useContext(ThemeContext)
  const app = useApp({ id: props.name })
  if (isValidElement(name)) return name
  if (!name) return null
  const extImg = name && (name[0] === '/' || name.indexOf('http') === 0) ? name : null
  let iconImg = extImg
  if (app) {
    const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
    iconImg = isDark ? app.iconLight || app.icon : app.icon
  }
  if (iconImg) {
    return <SVG svg={iconImg} cleanup={['width', 'height']} {...props} />
  }
  return null
}
