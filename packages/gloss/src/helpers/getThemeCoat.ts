import { ThemeObject } from '@o/css'

// this lets you do simple subsets using syntax:
// <Button coat="action" />
const cache = new WeakMap<
  ThemeObject,
  {
    [key: string]: ThemeObject
  }
>()

export function getThemeCoat(name: string | undefined, inTheme: ThemeObject): ThemeObject {
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

function createCoatTheme(theme: ThemeObject, coat: string): ThemeObject {
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
    _coatName: coat,
    _isCoat: true,
    _originalTheme: theme,
  }
}