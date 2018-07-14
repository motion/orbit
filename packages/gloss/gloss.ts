import * as React from 'react'
import fancyElement from './fancyElement'
import css, { validCSSAttr } from '@mcro/css'
import JSS from './stylesheet'
import { attachTheme } from './theme/attachTheme'

import * as Helpers_ from '@mcro/css'
export const Helpers = Helpers_
export const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const GLOSS_IGNORE_COMPONENT_SYMBOL = '__GLOSS_IGNORE_COMPONENT__'

export { Theme } from './theme/Theme'
export { ThemeProvide } from './theme/themeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'
export { CSSPropertySet, cssNameMap, psuedoKeys } from '@mcro/css'

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

export type Options = {
  dontTheme?: boolean
  glossProp?: string
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
  createElement: Function
  Helpers: Object = Helpers
  // for debug
  JSS = JSS

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.css = css(opts)
    this.helpers = this.css.helpers
    this.stylesheet = JSS.createStyleSheet()
    this.themeSheet = JSS.createStyleSheet()
    this.createElement = fancyElement(this, this.stylesheet, this.themeSheet)
    // @ts-ignore
    this.decorator.createElement = this.createElement
  }

  attach = () => {
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
      return this.createSimpleGlossComponent('div', maybeNameOrComponent)
    }
    // view('div', {}) or view(OtherView, {})
    if (glossSimpleComponentArgs(maybeNameOrComponent, shortStyles)) {
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

  private getAllThemes = View => {
    // skipParentStyles =
    //    store parent style keys we need to skip when applying themes
    //    this is because themes generate inline styles that would clobber static classnames
    //    but we can easily look up and see which static styles are above
    //    this cache here stores the keys to skip at each level in an array of objects for perf
    let skipParentStyleKeys = []
    let views = []
    let curView = View
    while (curView) {
      // FIND SKIPS
      const skipsForView = {}
      const skipIndex = skipParentStyleKeys.length
      for (const key of Object.keys(curView.style)) {
        skipsForView[key] = true
      }
      // merge in the previous skips as they should cumulative as we go down
      if (skipIndex > 0) {
        const previousSkips = skipParentStyleKeys[skipIndex - 1]
        for (const key of Object.keys(previousSkips)) {
          skipsForView[key] = true
        }
      }
      // END FIND SKIPS
      skipParentStyleKeys.push(skipsForView)
      views.push(curView)
      curView = curView.child
    }
    const lastViewIndex = views.length - 1
    return props => {
      let styles
      // apply bottom to top
      for (let i = lastViewIndex; i >= 0; i--) {
        // skip empty theme views
        if (!views[i].theme) {
          continue
        }
        // fast merge
        const curTheme = views[i].theme(props)
        for (const key of Object.keys(curTheme)) {
          // skip parent static styles!
          if (i > 0) {
            if (skipParentStyleKeys[i - 1][key]) {
              continue
            }
          }
          if (!styles) {
            styles = {}
          }
          styles[key] = curTheme[key]
        }
      }
      return styles
    }
  }

  private getAllStyles = (View, tagName) => {
    const styles = {
      [tagName]: {},
    }
    let curView = View
    while (curView) {
      if (curView.style) {
        for (const key of Object.keys(curView.style)) {
          // valid attribute, treat as normal
          if (validCSSAttr(key)) {
            // dont overwrite as we go down
            if (typeof styles[tagName][key] === 'undefined') {
              styles[tagName][key] = curView.style[key]
            }
          } else {
            // were defining a boolean prop style
            //   looks like: <Component tall />
            //   via: view({ color: 'red', tall: { height: '100%' } })
            const prop = key
            const styleObj = curView.style[prop]
            if (typeof styleObj === 'object') {
              // dont overwrite as we go down
              if (typeof styles[prop] === 'undefined') {
                styles[prop] = styleObj
              }
            }
          }
        }
      }
      curView = curView.child
    }
    return styles
  }

  private createSimpleGlossComponent = (target, styles) => {
    const elementCache = new WeakMap()
    const isParentComponent = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
    const id = `_${uid()}`
    let name = target.name || target
    let themeUpdate
    let hasAttachedStyles = false
    let targetElement = target
    if (isParentComponent) {
      targetElement = target.displayName
      name = targetElement
    }
    const InnerView = <GlossView>attachTheme(allProps => {
      // basically PureRender
      if (elementCache.has(allProps)) {
        return elementCache.get(allProps)
      }
      // allow View.defaultProps
      // @ts-ignore
      const { forwardRef, ...props } = {
        ...View.defaultProps,
        ...allProps,
      }
      // attach theme/styles on first use
      if (!hasAttachedStyles) {
        try {
          View.compiledStyles = this.getAllStyles(View, name)
          this.attachStyles(`${id}`, View.compiledStyles)
        } catch (err) {
          console.log('error attaching styles', target, name, styles)
          console.log('err', err)
        }
        hasAttachedStyles = true
      }
      // detect child or parent theme
      if (!themeUpdate) {
        themeUpdate = this.createThemeManager(id, this.getAllThemes(View), name)
      }
      // update theme
      if (themeUpdate) {
        themeUpdate(props)
      }
      // TODO: probably can avoid passing glossUID through props
      const element = this.createElement(targetElement, {
        glossUID: id,
        ref: forwardRef,
        ...props,
      })
      elementCache.set(props, element)
      return element
    })
    // forward ref
    const View = React.forwardRef((props, ref) =>
      React.createElement(InnerView, { ...props, forwardRef: ref }),
    )
    // TODO: babel transform to auto attach name?
    View.displayName = View.displayName || name
    View.style = styles
    if (isParentComponent) {
      View.child = target
    }
    View[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
    // forward ref
    return View
  }

  private createThemeManager = (uid, getTheme, forKey?: string) => {
    const activeThemeKey = {}
    const cssProcessor = this.css
    const selectors = {}
    return (props, self) => {
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
