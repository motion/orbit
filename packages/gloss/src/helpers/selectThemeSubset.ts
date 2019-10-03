import { ThemeObject } from '@o/css/src/css'

import { CompiledTheme } from '../theme/createTheme'
import { ThemeSelect } from '../theme/Theme'
import { UnwrapTheme } from './useTheme'
import { weakKey } from './WeakKeys'

type PartialTheme = Partial<CompiledTheme>

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

export function selectThemeSubset(
  themeSubSelect: ThemeSelect,
  theme: CompiledTheme,
): CompiledTheme {
  if (!themeSubSelect) {
    return theme
  }
  if (theme) {
    // unwrap from its proxy to avoid triggering change tracking
    theme = theme[UnwrapTheme] || theme
  }
  const namePrefix = `theme-${theme.name}`
  if (typeof themeSubSelect === 'function') {
    return createSubSetTheme(
      `${namePrefix}-fn${weakKey(themeSubSelect)}`,
      theme,
      themeSubSelect(theme),
    )
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
  return createSubSetTheme(`${namePrefix}-${themeSubSelect}`, theme, selectedTheme)
}

const createSubSetTheme = (
  name: string,
  parent: CompiledTheme,
  child: ThemeObject | CompiledTheme,
) => {
  return {
    ...parent,
    ...child,
    coats: undefined,
    parent,
    name,
    _subThemeName: name,
    _isSubTheme: true,
  }
}
