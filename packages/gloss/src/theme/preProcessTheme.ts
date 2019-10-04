import { GlossProps } from '../gloss'
import { CompiledTheme, createTheme } from './createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'
import { unwrapTheme, UnwrapThemeSymbol } from './useTheme'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if themeSubSelect="" prop, select that subset of the theme

const themeAltCache = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

export const preProcessTheme = (props: GlossProps<any>, theme: CompiledTheme) => {
  if (props.theme || !theme) {
    return props.theme
  }
  const parent = unwrapTheme(theme)
  if (props.coat || props.themeSubSelect) {
    const altKey = getAltKey(props)
    const existing = getThemeFromCache(parent, altKey)
    if (existing) {
      return existing
    }
    const coatTheme = getThemeCoat(props.coat, parent)
    const subSetTheme = selectThemeSubset(props.themeSubSelect, coatTheme)
    const next = subSetTheme || coatTheme
    if (next && next !== parent) {
      let nextTheme = createTheme(next, false)
      if (props.themeSubSelect && next._isSubTheme) {
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

function getAltKey(props: GlossProps<any>) {
  return `coat${props.coat || '_'}-sub${props.themeSubSelect || '_'}`
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
