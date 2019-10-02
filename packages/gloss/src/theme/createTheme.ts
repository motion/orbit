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
  return res
}

export function createThemes<A extends Partial<ThemeObject>>(themes: {
  [key: string]: A
}): { [key: string]: CompiledTheme<A> } {
  // ensure we don't have name collisions
  const existing = new Set<string>()
  const duplicates = new Set<Partial<ThemeObject>>()
  return Object.freeze(
    Object.keys(themes).reduce((acc, key) => {
      let theme = themes[key]
      if (typeof theme !== 'function') {
        if (duplicates.has(theme)) {
          // clone duplicate themes
          theme = {
            ...theme,
            name: key,
          }
        } else {
          theme.name = key
        }
      }
      const name = theme.name!
      if (process.env.NODE_ENV === 'development') {
        if (existing.has(name)) {
          console.warn(
            'Themes error on themes:',
            themes,
            Object.keys(themes).map(k => `key: ${k}, name: ${themes[k].name}`),
          )
          throw new Error(`Name collision on theme: ${name}`)
        }
        existing.add(name)
      }
      duplicates.add(theme)
      if (name) {
        acc[key] = createTheme(theme)
      } else {
        throw new Error(`Unreachable`)
      }
      return acc
    }, {}),
  )
}
