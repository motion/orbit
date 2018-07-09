import fancyElement from './fancyElement'
import css from '@mcro/css'
import JSS from './stylesheet'
import { attachTheme } from './theme/attachTheme'

import * as Helpers_ from '@mcro/css'
export const Helpers = Helpers_

export { Theme } from './theme/Theme'
export { ThemeProvide } from './theme/themeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'

export type Options = {
  dontTheme?: boolean
  glossProp?: string
  baseStyles?: Object
  tagName?: string
  toColor?: Function
  isColor?: Function
}

interface GlossView {
  (props: Object): any
  theme?: Object
  style?: Object
  displayName?: string
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
  baseStyles?: Object
  createElement: Function
  Helpers: Object = Helpers
  // for debug
  JSS = JSS

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.css = css(opts)
    this.helpers = this.css.helpers
    this.stylesheet = JSS.createStyleSheet()
    this.stylesheet.attach()
    this.themeSheet = JSS.createStyleSheet()
    this.themeSheet.attach()
    if (opts.baseStyles) {
      this.baseStyles = true
      this.attachStyles(null, opts.baseStyles)
    }
    this.createElement = fancyElement(this, this.stylesheet, this.themeSheet)
    // @ts-ignore
    this.decorator.createElement = this.createElement
  }

  decorator = (maybeNameOrComponent: any, shortStyles?: Object) => {
    if (!maybeNameOrComponent) {
      console.error('invalid view given to gloss', arguments)
      return () => this.createElement('div', { children: 'Error Component' })
    }
    // Shorthand views --
    // view({})
    if (typeof maybeNameOrComponent === 'object') {
      return this.createSimpleGlossComponent('div', maybeNameOrComponent)
    }
    // view('div', {})
    if (typeof maybeNameOrComponent === 'string') {
      return this.createSimpleGlossComponent(maybeNameOrComponent, shortStyles)
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
    Child.prototype.gloss = this
    Child.prototype.glossStylesheet = this.stylesheet
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

  createSimpleGlossComponent = (tagName, styles) => {
    const id = uid()
    const elementCache = new WeakMap()
    let themeUpdate
    const View = <GlossView>attachTheme(props => {
      // basically PureRender for stylsheet updates
      if (elementCache.has(props)) {
        return elementCache.get(props)
      }
      // attach theme on first use
      if (View.theme && !themeUpdate) {
        themeUpdate = this.createThemeManager(id, View.theme)
      }
      // update theme
      if (themeUpdate) {
        themeUpdate(props)
      }
      // TODO: probably can avoid passing through props
      const element = this.createElement(tagName, {
        glossUID: id,
        ...props,
      })
      elementCache.set(props, element)
      return element
    })
    this.attachStyles(`${id}`, { [tagName]: styles })
    View.displayName = tagName
    View.style = styles
    return View
  }

  createThemeManager = (uid, getTheme) => {
    const activeThemeKey = {}
    const cssProcessor = this.css
    const selectors = {}
    return (props, self) => {
      if (!props.theme) {
        console('no theme', props)
        return
      }
      const childTheme = getTheme(props, self)
      const rules = {}
      let hasRules = false
      for (const name of Object.keys(childTheme)) {
        const style = cssProcessor(childTheme[name])
        const key = JSON.stringify(style)
        if (key === activeThemeKey[name]) {
          continue
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
      if (hasRules) {
        this.themeSheet.addRules(rules)
      }
    }
  }

  // runs niceStyleSheet on non-function styles
  attachStyles = (
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
      if (typeof style === 'function') {
        this.stylesheet[stylesKey] = style
        continue
      }
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
