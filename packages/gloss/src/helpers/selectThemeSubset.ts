import { ThemeObject } from '@mcro/css'

const cacheKey = new WeakMap<ThemeObject, Set<Object>>()
const cacheVal = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

export const selectThemeSubset = (prefix: string, theme: ThemeObject): ThemeObject => {
  // read from cache
  if (cacheKey.has(theme)) {
    const isCached = cacheKey.get(theme).has(prefix)
    if (isCached) {
      return cacheVal.get(theme)[prefix]
    }
  }

  // generate new subset theme
  const len = prefix.length
  const o1 = { ...theme }
  for (const key in theme) {
    if (key.indexOf(prefix) === 0) {
      const newKey = key.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      o1[newKeyCamelCase] = theme[key]
    }
  }

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }
  cacheKey.get(theme).add(prefix)
  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }
  cacheVal.get(theme)[prefix] = o1

  return o1
}
