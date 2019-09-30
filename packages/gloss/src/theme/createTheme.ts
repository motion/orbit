import { Color } from '@o/color'
import { AlternateThemeSet, ThemeObject, ThemeValue } from '@o/css'

type WrappedTheme<A extends ThemeObject> = {
  [key in keyof A]: A[key] extends AlternateThemeSet ? A[key] : ThemeValue<A>
}

let id = 0

export function createTheme<A extends ThemeObject>(theme: A): WrappedTheme<A> {
  const name = `${theme.name || `theme-${id++}`}`
  return Object.keys(theme).reduce((acc, key) => {
    const val = acc[key]
    if (key === 'coats' || val instanceof Color) {
      acc[key] = val
    } else {
      acc[key] = createThemeValue(name, key, val)
    }
    return acc
  }, {}) as any
}

function createThemeValue(themeName: string, key: string, val: any) {
  return {
    get: () => val,
    cssVariable: `${themeName}_${key}`,
  }
}
