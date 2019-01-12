import { useContext } from 'react'
import { ThemeContext } from '@mcro/ui'
import { useStoresSafe } from './useStoresSafe'

export function useIntegrationIcon({ icon }) {
  const { sourcesStore } = useStoresSafe()
  const { activeTheme } = useContext(ThemeContext)
  const extImg = icon && (icon[0] === '/' || icon.indexOf('http') === 0) ? icon : null
  const allSourcesMap = sourcesStore.allSourcesMap
  let iconImg = extImg
  if (allSourcesMap[icon]) {
    const display = allSourcesMap[icon].display
    if (display) {
      const isDark = activeTheme.background.isDark && activeTheme.background.isDark()
      iconImg = isDark ? display.iconLight || display.icon : display.icon
    } else {
      console.log('no config for...', icon)
    }
  }
  return iconImg
}
