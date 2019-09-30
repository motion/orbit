import { Color } from '@o/color'
import { ThemeCoats, ThemeObject, ThemeValueLike } from '@o/css'

export type CompiledTheme<A extends Partial<ThemeObject> = any> = {
  [key in keyof A]: A[key] extends ThemeCoats ? A[key] : ThemeValueLike<A>
}

let id = 0

export function createTheme<A extends Partial<ThemeObject>>(theme: A): CompiledTheme<A> {
  const name = `${theme.name || `theme-${id++}`}`
  return Object.keys(theme).reduce((acc, key) => {
    const val = theme[key]
    if (key === 'coats' || val instanceof Color) {
      acc[key] = val
    } else {
      acc[key] = createThemeValue(name, key, val)
    }
    return acc
  }, {}) as any
}

export class ThemeValue<A> implements ThemeValueLike<A> {
  constructor(public cssVariable: string, public value: A) {}
  get() {
    return this.value
  }
}

function createThemeValue<A>(themeName: string, key: string, val: A) {
  return new ThemeValue<A>(`${themeName}-${key}`, val)
}
