// @flow
import fancyElement from './fancyElement'
import css from '@mcro/css'
import JSS from './stylesheet'
import * as Helpers_ from '@mcro/css'

// exports
import ThemeProvide_ from './components/themeProvide'
import Theme_ from './components/theme'
export const Theme = Theme_
export const ThemeProvide = ThemeProvide_
export const Helpers = Helpers_

// type exports
export type { Transform, Color } from '@mcro/css'
export type Options = {
  dontTheme?: boolean,
  themeKey: string | boolean,
  baseStyles?: Object,
  tagName?: boolean,
  toColor?: Function,
  isColor?: Function,
}

const { hash } = Helpers

const DEFAULT_OPTS = {
  themeKey: 'theme',
}

let idCounter = 0
function uid() {
  return idCounter++
}

export class Gloss {
  options: Options
  css: (a: Object) => Object
  baseStyles: ?Object
  createElement: Function
  Helpers: Object = Helpers
  attachedStyles: Object = {}

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

  decorator = (Child: Function) => {
    if (Child.prototype) {
      const { attachStyles, css } = this

      Child.prototype.glossElement = this.createElement
      Child.prototype.gloss = this
      Child.prototype.glossStylesheet = this.stylesheet

      const hasTheme = Child.theme && typeof Child.theme === 'function'
      const themeSheet = JSS.createStyleSheet().attach()
      const ViewCache = {}
      const id = `${Math.random()}`.replace('.', '')

      if (hasTheme) {
        Child.prototype.glossUpdateTheme = function(props) {
          this.theme = this.theme || themeSheet
          let activeTheme
          if (typeof props.theme === 'object') {
            activeTheme = { base: props.theme }
          } else {
            activeTheme =
              this.context.uiThemes &&
              this.context.uiThemes[
                props.theme || this.context.uiActiveThemeName
              ]
          }
          if (activeTheme) {
            const childTheme = Child.theme(props, activeTheme, this)

            // cache
            const oldKey = this.themeKey
            this.themeKey = `${id}${hash(childTheme)}`
            if (ViewCache[this.themeKey]) {
              ViewCache[this.themeKey]++
              return
            }
            if (oldKey) {
              ViewCache[this.themeKey]--
              if (ViewCache[this.themeKey] === 0) {
                for (const key of this.themeActiveRules) {
                  this.theme.deleteRule(key)
                }
              }
            }
            ViewCache[this.themeKey] = 1

            const rules = {}
            for (const name of Object.keys(childTheme)) {
              const style = css(childTheme[name])
              const selector = `${name}--${this.themeKey}--theme`
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
          // remove cache
          ViewCache[this.themeKey]--
          if (ViewCache[this.themeKey] === 0 && this.themeActiveRules) {
            for (const key of this.themeActiveRules) {
              this.theme.deleteRule(key)
            }
          }
          if (ogcomponentWillUnmount) {
            return ogcomponentWillUnmount.call(this, ...args)
          }
        }
      }

      // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
      if (process.env.NODE_ENV !== 'production') {
        let lastUpdatedStyles = null
        const ogrender = Child.prototype.render
        Child.prototype.render = function(...args) {
          if (
            !lastUpdatedStyles ||
            (window.lastHotReload && lastUpdatedStyles > window.lastHotReload)
          ) {
            attachStyles(Child.glossUID, Child.style, true)
            lastUpdatedStyles = Date.now()
          }
          if (ogrender) {
            return ogrender.call(this, ...args)
          }
        }
      }

      // on first mount, attach styles
      const ogComponentWillMount = Child.prototype.componentWillMount
      Child.prototype.componentWillMount = function(...args) {
        if (!Child.glossUID) {
          Child.glossUID = uid()
          attachStyles(Child.glossUID, Child.style)
        }
        if (hasTheme) {
          this.glossUpdateTheme(this.props)
        }
        if (ogComponentWillMount) {
          return ogComponentWillMount.call(this, ...args)
        }
      }
    }
  }

  // runs niceStyleSheet on non-function styles
  attachStyles = (
    childKey: ?string,
    styles: ?{ [a: string]: Object },
    force: boolean = false
  ): void => {
    if (!styles) {
      return null
    }
    for (const key of Object.keys(styles)) {
      const style = styles[key]
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

export default function glossFactory(options: Options): Gloss {
  return new Gloss(options)
}
