import fancyElement from './fancyElement'
import css from '@mcro/css'
import { Options } from './types'
import { simpleViewFactory } from './simpleViewFactory'

import * as Helpers_ from '@mcro/css'
export const Helpers = Helpers_
export const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const GLOSS_IGNORE_COMPONENT_SYMBOL = '__GLOSS_IGNORE_COMPONENT__'

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
  helpers: any
  options: Options
  createElement: Function
  createSimpleView: Function
  Helpers: Object = Helpers

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.css = css(opts)
    this.createSimpleView = simpleViewFactory(this.css)
    this.helpers = this.css.helpers
    this.createElement = fancyElement(this)
  }

  decorator = (maybeNameOrComponent: any, shortStyles?: Object) => {
    if (!maybeNameOrComponent) {
      console.error('invalid view given to gloss', arguments)
      return () => this.createElement('div', { children: 'Error Component' })
    }
    // Shorthand views --
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
