import { IconProps, ThemeContext } from '@mcro/ui'
import React, { isValidElement, useContext } from 'react'
import { SVG } from '../views/SVG'
import { useStoresSimple } from './useStores'

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
    const source = allSourcesMap[name]
    if (source) {
      const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
      iconImg = isDark ? source.iconLight || source.icon : source.icon
    } else {
      console.log('no config for...', name)
    }
  }
  if (iconImg) {
    return <SVG svg={iconImg} cleanup={['width', 'height']} {...props} />
  }
  return null
}
