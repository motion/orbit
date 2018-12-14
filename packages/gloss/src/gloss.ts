import { glossView } from './glossView'

// gloss
export const gloss = glossView

// configureGloss
export { configureGloss } from './config'

// ...helpful functions
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
export { GlossView } from './glossView'
export { GLOSS_IGNORE_COMPONENT_SYMBOL } from './symbols'
export { alphaColor } from './helpers/alphaColor'
export { propsToStyles } from './helpers/propsToStyles'
export { propsToThemeStyles } from './helpers/propsToThemeStyles'
export { Theme } from './theme/Theme'
export { ThemeMaker } from './theme/ThemeMaker'
export { ThemeProvide } from './theme/ThemeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'
export { colorToString, isGlossArguments } from './helpers/helpers'
