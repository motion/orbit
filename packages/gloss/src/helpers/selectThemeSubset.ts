import { ThemeObject } from '@o/css'
import { ThemeSelect } from '../theme/Theme'

type PartialTheme = Partial<ThemeObject>

const cacheKey = new WeakMap<ThemeObject, Set<Object>>()
const cacheVal = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

export function selectThemeSubset(prefix: ThemeSelect, theme: ThemeObject): ThemeObject {
  if (!prefix) {
    return theme
  }

  const proxyParentTheme = child =>
    new Proxy(child, {
      get(target, key) {
        return Reflect.get(target, key) || Reflect.get(theme, key)
      },
    }) as ThemeObject

  if (typeof prefix === 'function') {
    return proxyParentTheme(prefix(theme))
  }

  // read from cache
  let key = cacheKey.get(theme)
  if (key) {
    const isCached = key.has(prefix)
    const cached = cacheVal.get(theme)
    if (isCached && cached) {
      return cached[prefix]
    }
  }

  // generate new subset theme
  const len = prefix.length
  const selectedTheme: PartialTheme = {}
  for (const key in theme) {
    if (key.indexOf(prefix) === 0) {
      const newKey = key.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      selectedTheme[newKeyCamelCase] = theme[key]
    }
  }

  // proxy back to full theme
  const fullTheme = proxyParentTheme(selectedTheme)

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }

  key = cacheKey.get(theme)
  if (key) key.add(prefix)

  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }

  const val = cacheVal.get(theme)
  if (val) val[prefix] = fullTheme

  return fullTheme
}
