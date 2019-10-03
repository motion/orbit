import { ThemeObject } from '@o/css/src/css'

import { weakKey } from '../helpers/WeakKeys'
import { CompiledTheme } from './createTheme'
import { ThemeSelect } from './Theme'
import { UnwrapTheme } from './useTheme'

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
  if (typeof themeSubSelect === 'function') {
    return createSubSetTheme(
      `subfn${weakKey(themeSubSelect)}`,
      theme,
      themeSubSelect(theme),
      themeSubSelect,
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
  return createSubSetTheme(themeSubSelect, theme, selectedTheme, themeSubSelect)
}

const createSubSetTheme = (
  name: string,
  parent: CompiledTheme,
  child: ThemeObject | CompiledTheme,
  themeSubSelect: ThemeSelect,
) => {
  return {
    ...parent,
    ...child,
    coats: undefined,
    parent,
    name,
    _subThemeName: name,
    _themeSubSelect: themeSubSelect,
    _isSubTheme: true,
  }
}