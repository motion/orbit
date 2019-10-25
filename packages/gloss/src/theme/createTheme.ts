import { ThemeCoats, ThemeObject, ThemeValueLike } from '@o/css'

import { isPlainObj } from '../helpers/helpers'
import { ThemeValue } from './ThemeValue'

export type CompiledTheme<A extends Partial<ThemeObject> = any> = {
  [key in keyof A]: A[key] extends ThemeCoats | string | number ? A[key] : ThemeValueLike<A>
}

let id = 0
const ThemeMap = new WeakMap()

export function createTheme<A extends Partial<ThemeObject>>(
  theme: A,
  parentName: string = '',
  renameKeys = true,
): CompiledTheme<A> {
  if (ThemeMap.has(theme)) {
    return theme
  }
  const name = `${parentName ? parentName + '-' : ''}${theme.name || ''}` || `theme-${id++}`
  const res = Object.keys(theme).reduce((acc, key) => {
    let val = theme[key]
    const cssVariableName = `${key}`
    if (key === 'coats' && val) {
      // recurse into coats
      val = Object.keys(val).reduce((acc, ckey) => {
        acc[ckey] =
          typeof val[ckey] === 'function'
            ? val[ckey]
            : createTheme(
                {
                  ...val[ckey],
                  coats: undefined,
                },
                `${name}-coat`,
              )
        return acc
      }, {})
    } else if (val && typeof val.setCSSVariable === 'function') {
      if (renameKeys) {
        const res = val.setCSSVariable(cssVariableName)
        if (res) {
          val = res
        }
      }
    } else {
      if (key !== 'parent' && key !== 'name' && key[0] !== '_') {
        // recurse into sub-themes
        if (isPlainObj(val)) {
          val = createTheme(val, `${name}-sub-${key}`)
        } else if (!(val instanceof ThemeValue)) {
          val = new ThemeValue(cssVariableName, val)
        }
      }
    }
    acc[key] = val
    return acc
  }, {}) as any
  res.name = name
  ThemeMap.set(res, true)
  return res
}

const ThemesMap = new WeakMap()
export function createThemes<A extends Partial<ThemeObject>>(themes: {
  [key: string]: A
}): { [key: string]: CompiledTheme<A> } {
  if (ThemesMap.has(themes)) {
    return ThemesMap.get(themes)
  }
  // ensure we don't have name collisions
  const existing = new Set<string>()
  const duplicates = new Set<Partial<ThemeObject>>()
  const next = Object.freeze(
    Object.keys(themes).reduce((acc, key) => {
      let theme = themes[key]
      if (typeof theme !== 'function') {
        if (duplicates.has(theme)) {
          acc[key] = theme!
          return acc
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
  ThemesMap.set(themes, next)
  return next
}
