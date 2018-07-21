import fancyElement from './fancyElement'
import css from '@mcro/css'
import { Options } from './types'
import { simpleViewFactory } from './simpleViewFactory'

export const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const GLOSS_IGNORE_COMPONENT_SYMBOL = '__GLOSS_IGNORE_COMPONENT__'

export { propsToStyles } from './helpers/propsToStyles'
export { propsToThemeStyles } from './helpers/propsToThemeStyles'
export { Theme } from './theme/Theme'
export { ThemeMaker } from './theme/ThemeMaker'
export { ThemeProvide } from './theme/ThemeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'
export { CSSPropertySet, cssNameMap, psuedoKeys, validCSSAttr } from '@mcro/css'

export const color = require('@mcro/color').default

const glossSimpleComponentFirstArg = a => {
  if (!a) {
    return false
  }
  if (typeof a === 'string' || typeof a === 'object') {
    return true
  }
  return false
}

export const glossSimpleComponentArgs = (a, b) => {
  if (b && b[GLOSS_IGNORE_COMPONENT_SYMBOL]) {
    return false
  }
  if (typeof a === 'function' && typeof b === 'object') {
    return true
  }
  return glossSimpleComponentFirstArg(a)
}

const DEFAULT_OPTS = {}

export default class Gloss {
  css: any
  options: Options
  createElement: Function
  createSimpleView: Function

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.css = css(opts)
    this.createSimpleView = simpleViewFactory(this.css)
    this.createElement = fancyElement(this)
  }

  decorator = (maybeNameOrComponent: any, shortStyles?: Object) => {
    if (!maybeNameOrComponent) {
      throw new Error('No view passed into gloss')
    }
    // just object view({})
    if (
      typeof maybeNameOrComponent === 'object' &&
      !maybeNameOrComponent[GLOSS_SIMPLE_COMPONENT_SYMBOL]
    ) {
      return this.createSimpleView('div', maybeNameOrComponent)
    }
    // view('div', {}) or view(OtherView, {})
    if (glossSimpleComponentArgs(maybeNameOrComponent, shortStyles)) {
      return this.createSimpleView(maybeNameOrComponent, shortStyles)
    }
  }
}
