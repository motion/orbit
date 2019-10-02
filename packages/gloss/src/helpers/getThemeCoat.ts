import { CompiledTheme } from '../theme/createTheme'

// this lets you do simple subsets using syntax:
// <Button coat="action" />

export function getThemeCoat(name: string | undefined, theme: CompiledTheme): CompiledTheme {
  if (!name || typeof name !== 'string') {
    return theme
  }
  // prevent nesting coats, could work but not sure if wanted...
  // could be done using a weakmap likely
  while (theme._isCoat) {
    theme = theme.parent
  }
  if (!theme.coats) {
    return theme
  }
  return createCoatTheme(theme, name)
}

function createCoatTheme(theme: CompiledTheme, coat: string): CompiledTheme {
  if (!theme.coats) {
    throw new Error('No coats in themes')
  }
  if (!theme.coats[coat]) {
    throw new Error(`No alternate theme found: ${coat}`)
  }

  // coats can take parent theme as argument and return their theme:
  const next = theme.coats[coat]
  const nextTheme = typeof next === 'function' ? next(theme) : next

  // @ts-ignore
  return {
    ...nextTheme,
    parent: theme,
    name: `coat-${coat}`,
    _coatName: coat,
    _isCoat: true,
  }
}
