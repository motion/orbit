import { ThemeObject } from '@o/css'

import { ThemeSelect } from '../theme/Theme'

type PartialTheme = Partial<ThemeObject>

const cacheKey = new WeakMap<ThemeObject, Set<Object>>()
const cacheVal = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

const mergeTheme = (parent, child) => ({
  ...parent,
  ...child,
})

export function selectThemeSubset(themeSubSelect: ThemeSelect, theme: ThemeObject): ThemeObject {
  if (!themeSubSelect) {
    return theme
  }

  if (typeof themeSubSelect === 'function') {
    return mergeTheme(theme, themeSubSelect(theme))
  }

  // read from cache
  let key = cacheKey.get(theme)
  if (key) {
    const isCached = key.has(themeSubSelect)
    const cached = cacheVal.get(theme)
    if (isCached && cached) {
      return cached[themeSubSelect]
    }
  }

  // generate new subset theme
  const len = themeSubSelect.length
  const selectedTheme: PartialTheme = {}
  for (const subKey in theme) {
    if (subKey.indexOf(themeSubSelect) === 0) {
      const newKey = subKey.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      selectedTheme[newKeyCamelCase] = theme[subKey]
    }
  }

  // proxy back to full theme
  const fullTheme = {
    ...mergeTheme(theme, selectedTheme),
    parent: theme,
  }

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }

  key = cacheKey.get(theme)
  if (key) key.add(themeSubSelect)

  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }

  const val = cacheVal.get(theme)
  if (val) val[themeSubSelect] = fullTheme

  return fullTheme
}
