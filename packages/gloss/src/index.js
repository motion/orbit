// @flow
import fancyElement from './fancyElement'
import motionStyle from 'motion-css'
import { StyleSheet } from './stylesheet'
import { pickBy } from 'lodash'
import { flattenThemes, isFunc } from './helpers'
import deepExtend from 'deep-extend'

// exports
export { colorToString, objectToColor, expandCSSArray } from 'motion-css'
export type { Transform, Color } from 'motion-css'
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

  makeEL = (styles = {}) => fancyElement(this, styles)

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.baseStyles =
      opts.baseStyles && this.getStyles('parents', opts.baseStyles)
    this.decorator.createElement = this.makeEL()
  }

  decorator = (Child: Function | string, style: ?Object) => {
    // shorthand
    if (typeof Child === 'string') {
      const name = Child
      const createEl = this.makeEL(this.getStyles(name, { [name]: style }))
      return ({ getRef, ...props }) => createEl(name, { ref: getRef, ...props })
    }

    let themes
    if (Child.theme) {
      themes = this.getStyles('theme', Child.theme)
    }

    // class
    if (Child.prototype) {
      Child.prototype.glossElement = this.makeEL(
        this.getStyles(Child.name, Child.style)
      )

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
  getStyles = (name, style) => {
    if (!style) {
      return null
    }
    const finalStyles = {}
    for (const [key, val] of Object.entries(style)) {
      if (typeof val === 'function') {
        finalStyles[key] = val
      } else {
        finalStyles[key] = StyleSheet.create(this.niceStyleSheet(val), key)
      }
    }
    return finalStyles
  }
}

export default function glossFactory(options: Options): Function {
  return new Gloss(options)
}
