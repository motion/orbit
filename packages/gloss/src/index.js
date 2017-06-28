// @flow
import fancyElement from './fancyElement'
import motionStyle from '@mcro/css'
import { StyleSheet } from './stylesheet'
import { pickBy } from 'lodash'
import { flattenThemes, isFunc } from './helpers'
import deepExtend from 'deep-extend'

// exports
export { colorToString, objectToColor, expandCSSArray } from '@mcro/css'
export type { Transform, Color } from '@mcro/css'
// export components
export ThemeProvide from './components/themeProvide'
export Theme from './components/theme'

export type Options = {
  themeKey: string | boolean,
  baseStyles?: Object,
  tagName?: boolean,
  processColor?: Function,
}

const DEFAULT_OPTS = {
  themeKey: 'theme',
}

export class Gloss {
  options: Options

  makeCreateEl = (styles, name) =>
    fancyElement(this, this.getStyles(styles, name))

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.baseStyles =
      opts.baseStyles && this.getStyles('parents', opts.baseStyles)
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

    const themes = this.getStyles('theme', Child.theme)

    // class
    if (Child.prototype) {
      Child.prototype.glossElement = this.makeCreateEl(Child.style, 'style')
      Child.prototype.gloss = this.niceStyleSheet
      const ogRender = Child.prototype.render
      Child.prototype.render = function(nextProps, ...args) {
        if (themes) {
          // console.log('nextProps', nextProps, themes)
          // this.theme = getThemes(staticThemes, dynamicThemes)
        }
        return ogRender.call(this, nextProps, ...args)
      }
    }
    return Child
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
  getStyles = (name, styles) => {
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
