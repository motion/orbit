import * as React from 'react'
import fancyElement from './fancyElement'
import css, { validCSSAttr, Color } from '@mcro/css'
import JSS from './stylesheet'
import { ThemeContext } from './theme/ThemeContext'

import * as Helpers_ from '@mcro/css'
export const Helpers = Helpers_
export const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const GLOSS_IGNORE_COMPONENT_SYMBOL = '__GLOSS_IGNORE_COMPONENT__'

export { Theme } from './theme/Theme'
export { ThemeProvide } from './theme/themeProvide'
export { ThemeContext } from './theme/ThemeContext'
export { attachTheme } from './theme/attachTheme'
export { CSSPropertySet, cssNameMap, psuedoKeys } from '@mcro/css'

export type ThemeObject = {
  base: {
    background: Color
    borderColor: Color
    color: Color
  }
  hover: {
    background: Color
    borderColor: Color
    color: Color
  }
  active: {
    background: Color
    borderColor: Color
    color: Color
  }
  focus: {
    background: Color
    borderColor: Color
    color: Color
  }
}

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

type GlossViewConfig = {
  displayName?: string
}

interface GlossView<T> {
  (props: Object): any
  theme?: Object
  style?: Object
  displayName?: string
  compiledStyles?: Object
  child?: GlossView<any>
  withConfig?: (a: GlossViewConfig) => T
  defaultProps?: Object
  tagName?: string
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
    this.createSimpleElement = fancyElement(
      this,
      this.stylesheet,
      this.themeSheet,
      true,
    )
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

  private checkHasTheme = (View, isParentComponent) => {
    let hasTheme = !!View.theme
    if (isParentComponent) {
      let cur = View.child
      while (cur) {
        if (!!cur.theme) {
          hasTheme = true
        }
        cur = cur.child
      }
    }
    return hasTheme
  }

  // simple gloss view api
  private createSimpleGlossComponent = (target, styles) => {
    const isParentComponent = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
    const id = `_${uid()}`
    let name = target.name || target
    let displayName = name
    let themeUpdate
    let hasTheme
    let hasAttachedStyles = false
    let targetElement = target
    if (isParentComponent) {
      targetElement = name = targetElement.tagName || 'div'
    }
    let styleClassName
    const View: GlossView<any> = allProps => {
      // allow View.defaultProps
      // @ts-ignore
      const { forwardRef, className, ...props } = {
        ...View.defaultProps,
        ...allProps,
      }
      // attach theme/styles on first use
      if (!hasAttachedStyles) {
        try {
          View.compiledStyles = this.getAllStyles(View, name)
          this.attachStyles(id, View.compiledStyles)
          styleClassName = this.stylesheet
            .getRule(`${name}--${id}`)
            .selectorText.slice(1)
        } catch (err) {
          console.log('error attaching styles', target, name, styles)
          console.log('err', err)
        }
        hasAttachedStyles = true
      }
      const createElement = (extraClassName?) => {
        const el = this.createSimpleElement(
          targetElement,
          {
            ref: forwardRef,
            [`data-name`]: displayName,
            className: `${className || ''} ${styleClassName} ${extraClassName ||
              ''}`,
            ...props,
          },
          id,
        )
        return el
      }
      // themes!
      // we aren't just wrapping attachTheme on View because it adds a big layer for every simple view
      // we only attach themes now if they actually need it, to save a lot of nesting.
      if (typeof hasTheme === 'undefined') {
        hasTheme = this.checkHasTheme(View, isParentComponent)
      }
      if (hasTheme) {
        // detect child or parent theme
        if (!themeUpdate) {
          themeUpdate = this.createThemeManager(
            id,
            this.getAllThemes(View),
            name,
          )
        }
        return (
          <ThemeContext.Consumer>
            {({ allThemes, activeThemeName }) => {
              themeUpdate(props, null, allThemes[activeThemeName])
              const themeClassName = this.themeSheet
                .getRule(`${name}--${id}--theme`)
                .selectorText.slice(1)
              return createElement(themeClassName)
            }}
          </ThemeContext.Consumer>
        )
      }
      // no theme
      return createElement()
    }
    View.style = styles
    View.displayName = targetElement
    View.tagName = name
    if (isParentComponent) {
      View.child = target
    }
    View.withConfig = config => {
      if (config.displayName) {
        // set tagname and displayname
        displayName = config.displayName
        View.displayName = config.displayName
      }
      return View
    }
    View[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
    // forward ref
    return View
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
