import { IconProps, ThemeContext } from '@mcro/ui'
import React, { isValidElement, useContext } from 'react'
import { useStoresSimple } from '../helpers/useStores'
import { SVG } from '../views/SVG'

export function useSourceIcon(props: IconProps) {
  const { name } = props
  const { sourcesStore } = useStoresSimple()
  const { activeTheme } = useContext(ThemeContext)
  if (isValidElement(name)) return name
  if (!name) return null
  const extImg = name && (name[0] === '/' || name.indexOf('http') === 0) ? name : null
  const allSourcesMap = sourcesStore.allSourcesMap
  let iconImg = extImg
  if (allSourcesMap[name]) {
    const display = allSourcesMap[name].display
    if (display) {
      const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
      iconImg = isDark ? display.iconLight || display.icon : display.icon
    } else {
      console.log('no config for...', name)
    }
  }
  if (iconImg) {
    return <SVG svg={iconImg} cleanup={['width', 'height']} {...props} />
  }
  return null
}
