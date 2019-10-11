import { GlossProps } from '../types'
import { CompiledTheme, createTheme } from './createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'
import { unwrapTheme, UnwrapThemeSymbol } from './useTheme'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if subTheme="" prop, select that subset of the theme

const themeAltCache = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

export function processThemeSubset(props: GlossProps, theme: CompiledTheme): CompiledTheme | null {
  const parent = unwrapTheme(theme)
  const subSetTheme = selectThemeSubset(props.subTheme, parent)
  const coatTheme = getThemeCoat(props.coat, subSetTheme ? { ...parent, ...subSetTheme } : parent)
  return subSetTheme || coatTheme ? { ...subSetTheme, ...coatTheme } : null
}

export const preProcessTheme = (props: GlossProps, theme: CompiledTheme) => {
  const parent = unwrapTheme(theme)
  if (props.coat || props.subTheme) {
    const altKey = getAltKey(props, theme)
    const existing = getThemeFromCache(parent, altKey)
    if (existing) {
      return existing
    }
    let next = processThemeSubset(props, theme)
    if (next && next !== parent) {
      let nextTheme = createTheme(next)

      if (props.subTheme && next._isSubTheme) {
        // proxy back to parent but don't merge,
        // because we want sub-themes to be lighter (ie in CSS variable generation)
        // and generally to only enumerate their unique keys
        const ogSubTheme = nextTheme
        nextTheme = new Proxy(ogSubTheme, {
          get(target, key) {
            if (key === UnwrapThemeSymbol) {
              return ogSubTheme
            }
            if (Reflect.has(target, key)) {
              return Reflect.get(target, key)
            }
            return Reflect.get(parent, key)
          },
        })
      }
      setThemeInCache(parent, altKey, nextTheme)
      return nextTheme
    }
  }
  return theme
}

function getAltKey(props: GlossProps, parentTheme: CompiledTheme) {
  return `${parentTheme?.name ?? ''}-coat${props.coat || ''}-sub${props.subTheme || ''}`
}

function getThemeFromCache(parent: CompiledTheme, altKey: string) {
  const altCache = themeAltCache.get(parent)
  if (altCache && altCache[altKey]) {
    return altCache[altKey]
  }
}

function setThemeInCache(parent: CompiledTheme, key: string, theme: CompiledTheme) {
  if (!themeAltCache.has(parent)) {
    themeAltCache.set(parent, {})
  }
  const altCache = themeAltCache.get(parent)!
  altCache[key] = theme
}
