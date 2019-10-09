import { ThemeObject } from '@o/css'

import { weakKey } from '../helpers/WeakKeys'
import { CompiledTheme } from './createTheme'
import { ThemeSelect } from './Theme'

type PartialTheme = Partial<CompiledTheme>

// this selects a subset theme given a string
// because it's manipulating strings and objects we cache it
// because context provides the same theme object each time it can use weakmap for cache
// right now it does not delete as it seems very rare where you have many many themes

export function selectThemeSubset(
  subTheme: ThemeSelect,
  theme: CompiledTheme,
): CompiledTheme | null {
  if (!subTheme) {
    return theme
  }
  if (!theme._isCoat && subTheme === theme._subTheme) {
    // hasnt changed
    return theme
  }
  // allow only subsetting coats or original themes, not subsets
  while (theme._isSubTheme || theme._isCoat) {
    theme = theme.parent
  }
  if (typeof subTheme === 'function') {
    return createSubSetTheme(`subfn${weakKey(subTheme)}`, theme, subTheme(theme), subTheme)
  }
  // generate new subset theme
  const len = subTheme.length
  const selectedTheme: PartialTheme = {}
  for (const subKey in theme) {
    if (subKey.indexOf(subTheme) === 0 && typeof theme[subKey] !== 'undefined') {
      const newKey = subKey.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      selectedTheme[newKeyCamelCase] = theme[subKey]
    }
  }
  if (!Object.keys(selectedTheme).length) {
    // no changes made, dont do any extra work
    return null
  }
  return createSubSetTheme(subTheme, theme, selectedTheme, subTheme)
}

const createSubSetTheme = (
  name: string,
  parent: CompiledTheme,
  child: ThemeObject | CompiledTheme,
  subTheme: ThemeSelect,
) => {
  return {
    ...child,
    coats: undefined,
    parent,
    name,
    _subThemeName: name,
    _subTheme: subTheme,
    _isSubTheme: true,
  }
}
