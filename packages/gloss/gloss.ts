import fancyElement from './fancyElement'
import css from '@mcro/css'
import JSS from './stylesheet'
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
export { CSSPropertySet, cssNameMap, psuedoKeys } from '@mcro/css'

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

let idCounter = 1
function uid() {
  return idCounter++ % Number.MAX_SAFE_INTEGER
}

export default class Gloss {
  stylesheet: any
  themeSheet: any
  css: any
  helpers: any
  options: Options
  createElement: Function
  createSimpleElement: Function
  createSimpleView: Function
  Helpers: Object = Helpers
  // for debug
  JSS = JSS

  constructor(opts: Options = DEFAULT_OPTS) {
    this.createSimpleView = simpleViewFactory()
    this.options = opts
    this.css = css(opts)
    this.helpers = this.css.helpers
    this.stylesheet = JSS.createStyleSheet()
    this.themeSheet = JSS.createStyleSheet()
    this.createElement = fancyElement(this, this.stylesheet, this.themeSheet)
    this.createSimpleElement = fancyElement(
      this,
      this.stylesheet,
      this.themeSheet,
      true,
    )
    // @ts-ignore
    this.decorator.createElement = this.createElement
    this.stylesheet.attach()
    this.themeSheet.attach()
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
    // @view class MyView {}
    const Child = maybeNameOrComponent
    if (!Child.prototype || !Child.prototype.render) {
      console.log('not a class')
      return Child
    }
    // Class style component
    const { attachStyles } = this
    const id = uid()
    // @ts-ignore
    this.createElement.glossUID = id
    Child.prototype.glossElement = this.createElement
    // @ts-ignore
    Child.glossUID = id
    let hasAttached = false
    let updateTheme = null
    // patch child render to add themes
    const ogRender = Child.prototype.render
    const { createThemeManager } = this
    Child.prototype.render = function(...args) {
      // attach theme on first use, to avoid exrta sheet management
      if (!hasAttached) {
        // believe this may be a bugfix for decorators in a babel version
        // ON: babel update, check if we can hoist this above
        if (Child.theme && typeof Child.theme === 'function') {
          updateTheme = createThemeManager(Child.glossUID, Child.theme)
        }
        attachStyles(Child.glossUID, Child.style, true)
        hasAttached = true
      }
      // update theme
      if (updateTheme) {
        updateTheme(this.props, this)
      }
      // render
      if (ogRender) {
        return ogRender.call(this, ...args)
      }
    }
  }

  private createThemeManager = (uid, getTheme, forKey?: string) => {
    const activeThemeKey = {}
    const cssProcessor = this.css
    const selectors = {}
    return (props, self, theme) => {
      if (!props.theme) {
        props.theme = theme
      }
      if (!props.theme) {
        console.log('no theme', props)
        return
      }
      const rules = {}
      let hasRules = false
      const attachThemeStyle = (name, styles) => {
        const style = cssProcessor(styles)
        const key = JSON.stringify(style)
        if (key === activeThemeKey[name]) {
          return
        }
        activeThemeKey[name] = key
        if (!selectors[name]) {
          selectors[name] = `${name}--${uid}--theme`
        }
        const selector = selectors[name]
        hasRules = true
        rules[selector] = style
        if (this.themeSheet.classes[selector]) {
          this.themeSheet.deleteRule(selector)
        }
      }
      // attach themes
      const childTheme = getTheme(props, self)
      if (forKey) {
        attachThemeStyle(forKey, childTheme)
      } else {
        for (const name of Object.keys(childTheme)) {
          attachThemeStyle(name, childTheme[name])
        }
      }
      if (hasRules) {
        this.themeSheet.addRules(rules)
      }
    }
  }

  // runs niceStyleSheet on non-function styles
  private attachStyles = (
    childKey?: string,
    styles?: Object,
    force: boolean = false,
  ): void => {
    if (!styles) {
      return null
    }
    for (const key of Object.keys(styles)) {
      const style = styles[key]
      // @keyframes
      if (key[0] === '@') {
        this.stylesheet.addRule(key, style)
        continue
      }
      const stylesKey = childKey ? `${key}--${childKey}` : key
      if (force) {
        this.stylesheet.deleteRule(stylesKey)
      }
      if (!this.stylesheet.getRule(stylesKey)) {
        const niceStyle = this.css(style)
        this.stylesheet.addRule(stylesKey, niceStyle)
      }
    }
  }
}
