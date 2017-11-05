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
  themeSheets = {}

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
    optionalPropStyles?: Object
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
      this.attachStyles(id, { [tagName]: styles, ...optionalPropStyles })
      glossComponent.displayName = tagName
      return glossComponent
    }

    const Child = optionalNameOrChild

    if (!Child) {
      console.error(
        'invalid view given to gloss',
        optionalNameOrChild,
        optionalStyle,
        optionalPropStyles
      )
      return () => this.createElement('div', { children: 'Error Component' })
    }

    // @view decorated style component
    if (Child.prototype) {
      const { attachStyles, css } = this

      Child.prototype.glossElement = this.createElement
      Child.prototype.gloss = this
      Child.prototype.glossStylesheet = this.stylesheet

      const hasTheme = Child.theme && typeof Child.theme === 'function'
      const themeSheet = JSS.createStyleSheet().attach()
      const ViewCache = {}
      const id = uid()
      Child.glossUID = id
      this.themeSheets[id] = themeSheet

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

      let lastUpdatedStyles = null
      const ogrender = Child.prototype.render
      Child.prototype.render = function(...args) {
        // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
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
