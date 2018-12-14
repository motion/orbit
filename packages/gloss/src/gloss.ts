import { GLOSS_IGNORE_COMPONENT_SYMBOL } from './symbols'

// main exports

export { view } from './view'
export { configureView } from './config'

// helper exports
export { color } from '@mcro/color'
export {
  css,
  configureCSS,
  ThemeObject,
  CSSPropertySet,
  psuedoKeys,
  validCSSAttr,
  Color,
} from '@mcro/css'
export { SimpleView } from './view'
export { GLOSS_IGNORE_COMPONENT_SYMBOL } from './symbols'
export { alphaColor } from './helpers/alphaColor'
export { propsToStyles } from './helpers/propsToStyles'
export { propsToThemeStyles } from './helpers/propsToThemeStyles'
export { Theme } from './theme/Theme'
export { ThemeMaker } from './theme/ThemeMaker'
export { ThemeProvide } from './theme/ThemeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'

export const colorToString = obj => {
  const { model, color, valpha } = obj
  const hasAlpha = typeof valpha === 'number' && valpha !== 1
  if (model === 'rgb') {
    const inner = `${color[0]}, ${color[1]}, ${color[2]}`
    if (hasAlpha) {
      return `rgba(${inner}, ${valpha})`
    }
    return `rgb(${inner})`
  }
  if (model === 'hsl') {
    const inner = `${color[0]}, ${Math.round(color[1])}%, ${Math.round(color[2])}%`
    if (hasAlpha) {
      return `hsla(${inner}, ${valpha})`
    }
    return `hsl(${inner})`
  }
  return obj.toString()
}

const isGlossFirstArg = a =>
  typeof a === 'undefined' || typeof a === 'string' || typeof a === 'object'

export const isGlossArguments = (a, b) => {
  if (b && b[GLOSS_IGNORE_COMPONENT_SYMBOL]) {
    return false
  }
  if (typeof a === 'function' && typeof b === 'object') {
    return true
  }
  return isGlossFirstArg(a)
}
