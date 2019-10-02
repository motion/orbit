import { ThemeObject } from '@o/css/src/css'

import { CompiledTheme, createTheme } from '../theme/createTheme'
import { ThemeSelect } from '../theme/Theme'
import { UnwrapTheme } from './useTheme'

type PartialTheme = Partial<CompiledTheme>

const cacheKey = new WeakMap<CompiledTheme, Set<Object>>()
const cacheVal = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

const createSubSetTheme = (
  name: string,
  parent: CompiledTheme,
  child: ThemeObject | CompiledTheme,
) => {
  return createTheme({
    name: `${parent.name}-sub-${name}`,
    ...parent,
    ...child,
    parent,
    _isSubSet: true,
  })
}

const WeakKeys = new WeakMap<any, number>()
const weakKey = (x: any) => {
  if (!WeakKeys.has(x)) WeakKeys.set(x, Math.random())
  return WeakKeys.get(x)!
}

export function selectThemeSubset(
  themeSubSelect: ThemeSelect,
  theme: CompiledTheme,
): CompiledTheme {
  if (!themeSubSelect) {
    return theme
  }

  // unwrap from its proxy to avoid triggering change tracking
  if (theme) {
    // @ts-ignore
    theme = theme[UnwrapTheme] || theme
  }

  if (typeof themeSubSelect === 'function') {
    return createSubSetTheme(`fn-${weakKey(themeSubSelect)}`, theme, themeSubSelect(theme))
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

  const fullTheme = createSubSetTheme(themeSubSelect, theme, selectedTheme)

  // write to cache
  if (!cacheKey.get(theme)) {
    cacheKey.set(theme, new Set())
  }

  key = cacheKey.get(theme)
  if (key) key.add(themeSubSelect)

  if (!cacheVal.get(theme)) {
    cacheVal.set(theme, {})
  }

  const subCache = cacheVal.get(theme)!
  subCache[themeSubSelect] = fullTheme

  return fullTheme
}
