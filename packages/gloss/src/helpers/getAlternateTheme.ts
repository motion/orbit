import { toColor } from '@o/color'
import { ThemeObject } from '@o/css'

// this lets you do simple subsets using syntax:
// <Button alt="action" />
const altCache = new WeakMap<
  ThemeObject,
  {
    [key: string]: ThemeObject
  }
>()

export function getAlternateTheme(name: string | undefined, inTheme: ThemeObject): ThemeObject {
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
  const next = createAlternateTheme(theme, name)
  alts[name] = next
  return next
}

function createAlternateTheme(theme: ThemeObject, alt: string): ThemeObject {
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
    background: altTheme.background || toColor('#000'),
    color: altTheme.color || toColor('#fff'),
    ...altTheme,
    _alternateName: alt,
    _isAlternate: true,
    _originalTheme: theme,
  }
}
