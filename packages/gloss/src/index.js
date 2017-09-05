// @flow
import fancyElement from './fancyElement'
import motionStyle from '@mcro/css'
import { StyleSheet } from './stylesheet'
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

const DEFAULT_OPTS = {
  themeKey: 'theme',
}

export class Gloss {
  options: Options
  niceStyle: any
  baseStyles: ?Object
  createElement: Function
  Helpers: Object = Helpers
  makeCreateEl = (styles: Object): Function =>
    fancyElement(this, this.getStyles(styles))

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.helpers = this.niceStyle.helpers
    this.baseStyles = opts.baseStyles ? this.getStyles(opts.baseStyles) : null
    this.createElement = this.makeCreateEl()
    this.decorator.createElement = this.createElement
  }

  decorator = (Child: Function | string, style: ?Object) => {
    // shorthand
    if (typeof Child === 'string') {
      const name = Child
      const createEl = this.makeCreateEl({ [name]: style }, name)
      return ({ getRef, ...props }) => createEl(name, { ref: getRef, ...props })
    }

    if (Child.prototype) {
      Child.prototype.glossElement = this.makeCreateEl(Child.style, 'style')
      Child.prototype.gloss = this
      const hasTheme = Child.theme && typeof Child.theme === 'function'
      if (!hasTheme) {
        return Child
      }

      if (!Child.prototype.theme) {
        Child.prototype.getTheme = function(theme) {
          let activeTheme
          if (typeof theme === 'object') {
            activeTheme = { base: theme }
          } else {
            activeTheme =
              this.context.uiThemes &&
              this.context.uiThemes[theme || this.context.uiActiveThemeName]
          }
          if (activeTheme) {
            return getStyles(Child.theme(this.props, activeTheme, this))
          }
          return null
        }

        Child.prototype.render = function(...args) {
          let activeTheme
          if (typeof this.props.theme === 'object') {
            activeTheme = { base: this.props.theme }
          } else {
            activeTheme =
              this.context.uiThemes &&
              this.context.uiThemes[
                this.props.theme || this.context.uiActiveThemeName
              ]
          }
          if (activeTheme) {
            this.theme = getStyles(Child.theme(this.props, activeTheme, this))
          }
          return ogRender.call(this, ...args)
        }
      }
    }
  }

  niceStyleSheet = (styles: Object, errorMessage: string): Object => {
    for (const style in styles) {
      if (!styles.hasOwnProperty(style)) continue
      const value = styles[style]
      if (value) {
        styles[style] = this.niceStyle(value, errorMessage)
      }
    }
    return styles
  }

  // runs niceStyleSheet on non-function styles
  getStyles = (styles: any): ?Object => {
    if (!styles) {
      return null
    }
    const functionalStyles = {}
    const staticStyles = {}
    for (const [key, val] of Object.entries(styles)) {
      if (typeof val === 'function') {
        functionalStyles[key] = val // to be run later
      } else {
        staticStyles[key] = val
      }
    }
    const stylesheet = {
      ...StyleSheet.create(this.niceStyleSheet(staticStyles)),
      ...functionalStyles,
    }
    return stylesheet
  }
}

export default function glossFactory(options: Options): Gloss {
  return new Gloss(options)
}
