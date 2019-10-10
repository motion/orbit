import { CompiledTheme } from './createTheme'

// this lets you do simple subsets using syntax:
// <Button coat="action" />

export function getThemeCoat(
  name: string | false | undefined,
  theme: CompiledTheme,
): CompiledTheme | null {
  // prevent nesting coats, could work but not sure if wanted...
  // could be done using a weakmap likely
  if (!name) return null
  const coat = getCoat(theme, name)
  if (!coat) return null
  return createCoatTheme(theme, coat)
}

function getCoat(theme: CompiledTheme, name: string | false | undefined) {
  if (!name || typeof name !== 'string') {
    return null
  }
  while (theme._isCoat || theme._isSubTheme) {
    theme = theme.parent
  }
  if (theme.coats) {
    return theme.coats[name]
  }
  return null
}

function createCoatTheme(
  theme: CompiledTheme,
  coat: CompiledTheme | ((parent: CompiledTheme) => CompiledTheme),
): CompiledTheme {
  // coats can take parent theme as argument and return their theme:
  const nextTheme = typeof coat === 'function' ? coat(theme) : coat
  return {
    ...nextTheme,
    parent: theme,
    name: coat,
    _coatName: coat,
    _isCoat: true,
  }
}
