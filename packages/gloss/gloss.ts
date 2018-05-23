import fancyElement from './fancyElement'
import css from '@mcro/css'
import JSS from './stylesheet'

import * as Helpers_ from '@mcro/css'
export const Helpers = Helpers_
export * from './components/themeProvide'
export * from './components/theme'

export type Options = {
  dontTheme?: boolean
  baseStyles?: Object
  tagName?: boolean
  toColor?: Function
  isColor?: Function
}

const DEFAULT_OPTS = {}

let idCounter = 0
function uid() {
  return idCounter++
}

export default class Gloss {
  stylesheet: any
  css: any
  helpers: any
  options: Options
  baseStyles?: Object
  createElement: Function
  Helpers: Object = Helpers
  themeSheets = {}
  // for debug
  JSS = JSS

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.css = css(opts)
    this.helpers = this.css.helpers
    this.stylesheet = JSS.createStyleSheet()
    this.stylesheet.attach()
    if (opts.baseStyles) {
      this.baseStyles = true
      this.attachStyles(null, opts.baseStyles)
    }
    this.createElement = fancyElement(this, this.stylesheet)
    // @ts-ignore
    this.decorator.createElement = this.createElement
  }

  decorator = (
    optionalNameOrChild: any,
    // these are only used for shorthand views
    optionalStyle?: Object,
    optionalPropStyles?: Object,
  ) => {
    // Short style component --  view('tagName', {})
    if (typeof optionalNameOrChild === 'string') {
      const tagName = optionalNameOrChild
      const styles = optionalStyle
      const id = uid()
      const glossComponent = props => {
        let finalProps
        // make propstyles work
        if (props && optionalPropStyles) {
          finalProps = {}
          for (const key of Object.keys(props)) {
            if (optionalPropStyles[key]) {
              finalProps[`$${key}`] = props[key]
            } else {
              finalProps[key] = props[key]
            }
          }
        } else {
          finalProps = props
        }
        return this.createElement(tagName, { glossUID: id, ...finalProps })
      }
      try {
        this.attachStyles(`${id}`, { [tagName]: styles, ...optionalPropStyles })
      } catch (err) {
        console.log('error attaching styles:', tagName, this, styles)
      }
      // @ts-ignore
      glossComponent.displayName = tagName
      return glossComponent
    }
    // Class style component
    const Child = optionalNameOrChild
    if (!Child) {
      console.error(
        'invalid view given to gloss',
        optionalNameOrChild,
        optionalStyle,
        optionalPropStyles,
      )
      return () => this.createElement('div', { children: 'Error Component' })
    }
    if (!Child.prototype || !Child.prototype.render) {
      console.log('not a class')
      return
    }
    const { css, attachStyles } = this
    const id = uid()
    // @ts-ignore
    this.createElement.glossUID = id
    Child.prototype.glossElement = this.createElement
    Child.prototype.gloss = this
    Child.prototype.glossStylesheet = this.stylesheet
    // babel 7 bugfix
    setTimeout(() => {
      console.log('decorating', Child, Child.theme)
      const hasTheme = Child.theme && typeof Child.theme === 'function'
      const themeSheet = JSS.createStyleSheet().attach()
      // @ts-ignore
      Child.glossUID = id
      this.themeSheets[id] = themeSheet
      if (hasTheme) {
        Child.prototype.glossUpdateTheme = function(props) {
          this.theme = this.theme || themeSheet
          const activeTheme =
            this.context.uiThemes &&
            this.context.uiThemes[this.context.uiActiveThemeName]
          if (activeTheme) {
            const childTheme = Child.theme(props, activeTheme, this)
            const rules = {}
            for (const name of Object.keys(childTheme)) {
              const style = css(childTheme[name])
              const selector = `${name}--${Child.glossUID}--theme`
              rules[selector] = style
              this.theme.deleteRule(selector)
            }
            this.themeActiveRules = Object.keys(rules)
            this.theme.addRules(rules)
          }
        }
        // for HMR needs to re-run on mount idk why
        if (process.env.NODE_ENV === 'development') {
          const ogComponentWillMount = Child.prototype.componentWillMount
          Child.prototype.componentWillMount = function(...args) {
            if (hasTheme) {
              this.glossUpdateTheme(this.props)
            }
            if (ogComponentWillMount) {
              return ogComponentWillMount.call(this, ...args)
            }
          }
        }
      }
      const ogrender = Child.prototype.render
      let hasSetStyles = false
      Child.prototype.render = function(...args) {
        console.log('check it out', hasTheme, this.theme)
        if (!hasSetStyles) {
          console.log('attaching', Child.glossUID, Child.style)
          attachStyles(Child.glossUID, Child.style, true)
          hasSetStyles = true
        }
        if (hasTheme) {
          this.glossUpdateTheme(this.props)
        }
        if (ogrender) {
          return ogrender.call(this, ...args)
        }
      }
    })
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
