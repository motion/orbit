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

export function selectThemeSubset(subTheme: ThemeSelect, theme: ThemeObject): ThemeObject {
  if (!subTheme) {
    return theme
  }

  if (typeof subTheme === 'function') {
    return mergeTheme(theme, subTheme(theme))
  }

  // read from cache
  let key = cacheKey.get(theme)
  if (key) {
    const isCached = key.has(subTheme)
    const cached = cacheVal.get(theme)
    if (isCached && cached) {
      return cached[subTheme]
    }
  }

  // generate new subset theme
  const len = subTheme.length
  const selectedTheme: PartialTheme = {}
  for (const subKey in theme) {
    if (subKey.indexOf(subTheme) === 0) {
      const newKey = subKey.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      selectedTheme[newKeyCamelCase] = theme[subKey]
    }
  }

  // proxy back to full theme
  const fullTheme = mergeTheme(theme, selectedTheme)

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }

  key = cacheKey.get(theme)
  if (key) key.add(subTheme)

  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }

  const val = cacheVal.get(theme)
  if (val) val[subTheme] = fullTheme

  return fullTheme
}
