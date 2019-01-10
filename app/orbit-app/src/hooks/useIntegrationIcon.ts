import { useContext } from 'react'
import { StoreContext } from '@mcro/black'
import { ThemeContext } from '@mcro/ui'

export function useIntegrationIcon({ icon }) {
  const { sourcesStore } = useContext(StoreContext)
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
