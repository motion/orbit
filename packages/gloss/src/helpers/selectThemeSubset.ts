import { ThemeObject } from '@mcro/css'

type PartialTheme = Partial<ThemeObject>

const cacheKey = new WeakMap<ThemeObject, Set<Object>>()
const cacheVal = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

export function selectThemeSubset(
  prefix: string | undefined | false,
  theme: ThemeObject,
): ThemeObject {
  if (!prefix) {
    return theme
  }

  // read from cache
  if (cacheKey.has(theme)) {
    const isCached = cacheKey.get(theme).has(prefix)
    if (isCached) {
      return cacheVal.get(theme)[prefix]
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
  const fullTheme = new Proxy(selectedTheme, {
    get(target, key) {
      return Reflect.get(target, key) || Reflect.get(theme, key)
    },
  }) as ThemeObject

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }
  cacheKey.get(theme).add(prefix)
  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }
  cacheVal.get(theme)[prefix] = fullTheme

  return fullTheme
}
