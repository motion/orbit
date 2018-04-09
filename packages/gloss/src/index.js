// @flow
import fancyElement from './fancyElement'
import css from '@mcro/css'
import JSS from '~/stylesheet'
import * as Helpers_ from '@mcro/css'

// exports
import ThemeProvide_ from './components/themeProvide'
import Theme_ from './components/theme'
export const Theme = Theme_
export const ThemeProvide = ThemeProvide_
export const Helpers = Helpers_

export type Options = {
  dontTheme?: boolean,
  baseStyles?: Object,
  tagName?: boolean,
  toColor?: Function,
  isColor?: Function,
}

const DEFAULT_OPTS = {}

let idCounter = 0
function uid() {
  return idCounter++
}

export default class Gloss {
  options: Options
  css: (a: Object) => Object
  baseStyles: ?Object
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
    this.decorator.createElement = this.createElement
  }

  decorator = (
    optionalNameOrChild: string | Function,
    optionalStyle?: Object,
    optionalPropStyles?: Object,
  ) => {
    if (typeof optionalNameOrChild === 'string') {
      // shorthand -- $('tagName', {}) style component
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
        this.attachStyles(id, { [tagName]: styles, ...optionalPropStyles })
      } catch (err) {
        console.log('error attaching styles:', tagName, this, styles)
      }
      glossComponent.displayName = tagName
      return glossComponent
    }

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

    // @view decorated style component
    if (Child.prototype && Child.prototype.render) {
      const { attachStyles, css } = this
      Child.prototype.glossElement = this.createElement
      Child.prototype.gloss = this
      Child.prototype.glossStylesheet = this.stylesheet
      const hasTheme = Child.theme && typeof Child.theme === 'function'
      const themeSheet = JSS.createStyleSheet().attach()
      const id = uid()
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
        // updateTheme on willUpdate
        const ogcomponentWillUpdate = Child.prototype.componentWillUpdate
        Child.prototype.componentWillUpdate = function(...args) {
          this.glossUpdateTheme(args[0])
          if (ogcomponentWillUpdate) {
            return ogcomponentWillUpdate.call(this, ...args)
          }
        }
        const ogcomponentWillUnmount = Child.prototype.componentWillUnmount
        Child.prototype.componentWillUnmount = function(...args) {
          if (ogcomponentWillUnmount) {
            return ogcomponentWillUnmount.call(this, ...args)
          }
        }
      }

      let lastUpdatedStyles = null
      const ogrender = Child.prototype.render
      if (Child.prototype.render) {
        Child.prototype.render = function(...args) {
          // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
          if (
            !lastUpdatedStyles ||
            (typeof window !== 'undefined' &&
              window.lastHotReload &&
              lastUpdatedStyles > window.lastHotReload)
          ) {
            attachStyles(Child.glossUID, Child.style, true)
            lastUpdatedStyles = Date.now()
          }
          if (ogrender) {
            return ogrender.call(this, ...args)
          }
        }
        // on first mount, attach styles
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
  }

  // runs niceStyleSheet on non-function styles
  attachStyles = (
    childKey: ?string,
    styles: ?{ [a: string]: Object },
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
