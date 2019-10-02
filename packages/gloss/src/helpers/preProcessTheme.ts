import { GlossProps } from '../gloss'
import { CompiledTheme, createTheme } from '../theme/createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'
import { UnwrapTheme } from './useTheme'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if themeSubSelect="" prop, select that subset of the theme

const themeAltCache = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

export const preProcessTheme = (props: GlossProps<any>, theme: CompiledTheme) => {
  if (props.theme) {
    return props.theme
  }
  theme = theme[UnwrapTheme] || theme
  if (props.coat || props.themeSubSelect) {
    const altKey = getAltKey(props)
    const existing = getThemeFromCache(altKey, theme)
    if (existing) {
      return existing
    }
    const coatTheme = getThemeCoat(props.coat, theme)
    const subSetTheme = selectThemeSubset(props.themeSubSelect, coatTheme)
    const nextTheme = createTheme({
      ...subSetTheme,
      coats: undefined, // no coat with sub-coats
      name: altKey,
    })
    setThemeInCache(altKey, theme, nextTheme)
    return nextTheme
  }
  return theme
}

function getAltKey(props: GlossProps<any>) {
  return `coat${props.coat || '_'}-sub${props.themeSubSelect || '_'}`
}

function getThemeFromCache(altKey: string, theme: CompiledTheme) {
  const altCache = themeAltCache.get(theme)
  if (altCache && altCache[altKey]) {
    return altCache[altKey]
  }
}

function setThemeInCache(key: string, parent: CompiledTheme, theme: CompiledTheme) {
  if (!themeAltCache.has(parent)) {
    themeAltCache.set(parent, {})
  }
  const altCache = themeAltCache.get(parent)!
  altCache[key] = theme
}
