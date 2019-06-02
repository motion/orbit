import { ThemeObject } from '@o/css'

// this lets you do simple subsets using syntax:
// <Button alt="action" />
const altCache = new WeakMap<
  ThemeObject,
  {
    [key: string]: ThemeObject
  }
>()

export function getAlternateTheme(
  name: string | undefined,
  inTheme: ThemeObject,
  shouldFallback?: boolean,
): ThemeObject {
  if (!name || typeof name !== 'string') {
    return inTheme
  }
  if (!inTheme.alternates) {
    return inTheme
  }
  let theme = inTheme
  // prevent nesting alternates, could work but not sure if wanted...
  // could be done using a weakmap likely
  if (theme._isAlternate) {
    theme = theme._originalTheme
  }
  // find, set, cache alt theme
  if (!altCache.has(theme)) {
    altCache.set(theme, {})
  }
  const alts = altCache.get(theme)
  if (!alts) {
    throw new Error('unreachable')
  }
  const cached = alts[name]
  if (cached) {
    return cached
  }
  const next = createAlternateTheme(theme, name, shouldFallback)
  alts[name] = next
  return next
}

function createAlternateTheme(
  theme: ThemeObject,
  alt: string,
  shouldFallback?: boolean,
): ThemeObject {
  if (!theme.alternates) {
    throw new Error('No alternates in themes')
  }
  if (!theme.alternates[alt]) {
    throw new Error(`No alternate theme found: ${alt}`)
  }

  // alternates can take parent theme as argument and return their theme:
  const next = theme.alternates[alt]
  const altTheme = typeof next === 'function' ? next(theme) : next

  return {
    ...(shouldFallback
      ? {
          background: theme.background,
          backgroundDisabled: theme.backgroundDisabled,
          backgroundDisabledActive: theme.backgroundActive,
          backgroundDisabledFocus: theme.backgroundFocus,
          borderColor: theme.borderColor,
          borderColorDisabled: theme.borderColorDisabled,
          borderColorDisabledActive: theme.borderColorActive,
          borderColorDisabledFocus: theme.borderColorFocus,
          color: theme.color,
          colorDisabled: theme.colorDisabled,
          colorDisabledActive: theme.colorActive,
          colorDisabledFocus: theme.colorFocus,
        }
      : null),
    // todo why types mad
    background: altTheme.background as any,
    color: altTheme.color as any,
    ...altTheme,
    _alternateName: alt,
    _isAlternate: true,
    _originalTheme: theme,
  }
}
