import { ThemeCoats, ThemeObject, ThemeValueLike } from '@o/css'

import { ThemeValue } from './ThemeValue'

export type CompiledTheme<A extends Partial<ThemeObject> = any> = {
  [key in keyof A]: A[key] extends ThemeCoats | string | number ? A[key] : ThemeValueLike<A>
}

let id = 0

export function createTheme<A extends Partial<ThemeObject>>(theme: A): CompiledTheme<A> {
  const name = `${theme.name || `theme-${id++}`}`
  const res = Object.keys(theme).reduce((acc, key) => {
    let val = theme[key]
    const cssVariableName = `${key}`
    if (key === 'coats') {
      // recurse into coats
      val = Object.keys(val).reduce((acc, ckey) => {
        acc[ckey] = typeof val[ckey] === 'function' ? val[ckey] : createTheme(val[ckey])
        return acc
      }, {})
    } else if (val && typeof val.setCSSVariable === 'function') {
      val.setCSSVariable(cssVariableName)
    } else {
      if (key !== 'parent' && key !== 'name' && key[0] !== '_') {
        val = new ThemeValue(cssVariableName, val)
      }
    }
    acc[key] = val
    return acc
  }, {}) as any
  res.name = name
  Object.freeze(res)
  return res
}

export function createThemes<A extends Partial<ThemeObject>>(themes: {
  [key: string]: A
}): { [key: string]: CompiledTheme<A> } {
  const names = Object.keys(themes)
    .map(k => themes[k].name)
    .filter(Boolean)
  return Object.freeze(
    Object.keys(themes).reduce((acc, key) => {
      if (!themes[key].name && !names.some(x => x === key)) {
        themes[key].name = key
      }
      acc[key] = createTheme(themes[key])
      return acc
    }, {}),
  )
}
