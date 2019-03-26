import { ThemeObject } from '@o/css'

// this lets you do simple subsets using syntax:
// <Button is="action" />

const isCache = new WeakMap<ThemeObject, { [key: string]: ThemeObject }>()

export function getIsPropTheme(
  props: { is?: string },
  theme: ThemeObject,
  shouldFallback?: boolean,
): ThemeObject {
  if (!props.is || typeof props.is !== 'string') {
    return theme
  }
  if (!theme.alternates) {
    return theme
  }
  if (!isCache.has(theme)) {
    isCache.set(theme, {})
  }
  const cached = isCache.get(theme)[props.is]
  if (cached) return cached
  const next = selectIsPropStyles(theme, props.is, shouldFallback)
  isCache.get(theme)[props.is] = next
  return next
}

function selectIsPropStyles(theme: ThemeObject, is: string, shouldFallback?: boolean) {
  return {
    ...(shouldFallback ? theme : null),
    ...theme.alternates[is],
  }
}
