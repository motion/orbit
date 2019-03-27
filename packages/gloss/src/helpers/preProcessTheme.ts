import { ThemeObject } from '@o/css'
import { selectThemeSubset } from './selectThemeSubset'

// this lets you do simple subsets using syntax:
// <Button alt="action" />

const altCache = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

export function getAlternateTheme(
  name: string | undefined,
  theme: ThemeObject,
  shouldFallback?: boolean,
): ThemeObject {
  if (!name || typeof name !== 'string') {
    return theme
  }
  if (!theme.alternates) {
    return theme
  }
  if (!altCache.has(theme)) {
    altCache.set(theme, {})
  }
  const cached = altCache.get(theme)[name]
  if (cached) return cached
  const next = selectIsPropStyles(theme, name, shouldFallback)
  altCache.get(theme)[name] = next
  return next
}

function selectIsPropStyles(theme: ThemeObject, alt: string, shouldFallback?: boolean) {
  return {
    ...(shouldFallback ? theme : null),
    ...theme.alternates[alt],
  }
}

// Default pre process theme is:
//   1. if is="" prop, drill down to that theme
//   2. if themeSelect="" prop, select that subset of the theme

export const preProcessTheme = (props: any, theme: ThemeObject) =>
  selectThemeSubset(props.themeSelect, getAlternateTheme(props.alt, theme))
