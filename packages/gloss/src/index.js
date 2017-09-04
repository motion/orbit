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

  Helpers = Helpers
  makeCreateEl = styles => fancyElement(this, this.getStyles(styles))

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.helpers = this.niceStyle.helpers
    this.baseStyles = opts.baseStyles && this.getStyles(opts.baseStyles)
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

        const { getStyles } = this
        Object.defineProperty(Child.prototype, 'theme', {
          get() {
            const { uiActiveThemeName, uiThemes } = this.context
            return (
              this.getTheme(this.props.theme) ||
              (uiThemes && uiThemes[uiActiveThemeName])
            )
          },
        })
      }
    }
  }

  niceStyleSheet = (styles: Object, errorMessage: string) => {
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
  getStyles = styles => {
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

export default function glossFactory(options: Options): Function {
  return new Gloss(options)
}
