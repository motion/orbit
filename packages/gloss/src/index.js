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
  makeCreateEl = (styles: ?Object): Function =>
    fancyElement(this, styles ? this.getStyles(styles) : null)

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
        const { getStyles } = this

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

        const ogRender = Child.prototype.render
        Child.prototype.render = function(...args) {
          const key = `${this.displayName || this.constructor.name}`
          console.time(`${key}.gettheme`)
          console.time('4')
          console.time('1')
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
          console.timeEnd('1')
          console.time('2')
          if (activeTheme) {
            console.time('2.1')
            const childTheme = Child.theme(this.props, activeTheme, this)
            console.timeEnd('2.1')
            console.time('2.2')
            this.theme = getStyles(childTheme)
            console.timeEnd('2.2')
          }
          console.timeEnd('2')
          console.timeEnd('4')
          console.timeEnd(`${key}.gettheme`)
          return ogRender.call(this, ...args)
        }
      }
    }
  }

  niceStyleSheet = (styles: Object, errorMessage: string): Object => {
    for (const style of Object.keys(styles)) {
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
    for (const key of Object.keys(styles)) {
      const val = styles[key]
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
