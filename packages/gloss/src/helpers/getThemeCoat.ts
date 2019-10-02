import { CompiledTheme } from '../theme/createTheme'

// this lets you do simple subsets using syntax:
// <Button coat="action" />
const cache = new WeakMap<
  CompiledTheme,
  {
    [key: string]: CompiledTheme
  }
>()

export function getThemeCoat(name: string | undefined, inTheme: CompiledTheme): CompiledTheme {
  if (!name || typeof name !== 'string') {
    return inTheme
  }
  if (!inTheme.coats) {
    return inTheme
  }
  let theme = inTheme
  // prevent nesting coats, could work but not sure if wanted...
  // could be done using a weakmap likely
  if (theme._isCoat) {
    theme = theme._originalTheme
  }
  // find, set, cache coat theme
  if (!cache.has(theme)) {
    cache.set(theme, {})
  }
  const coats = cache.get(theme)
  if (!coats) {
    throw new Error('unreachable')
  }
  const cached = coats[name]
  if (cached) {
    return cached
  }
  const next = createCoatTheme(theme, name)
  coats[name] = next
  return next
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
    _originalTheme: theme,
  }
}
