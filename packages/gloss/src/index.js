// @flow
import fancyElement from './fancyElement'
import motionStyle from 'motion-css'
import { StyleSheet } from './stylesheet'
import { pickBy } from 'lodash'
import { flattenThemes, isFunc } from './helpers'

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

class Gloss {
  options: Options

  makeCreateElement = (styles, theme) =>
    fancyElement(
      theme,
      this.baseStyles,
      styles || {},
      this.options,
      this.applyNiceStyles
    )

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.baseStyles =
      opts.baseStyles && this.getStyles('parents', opts.baseStyles)
    this.decorator.createElement = this.makeCreateElement()
  }

  decorator = (Child: Function | string, style: ?Object) => {
    // shorthand
    if (typeof Child === 'string') {
      const name = Child
      const createEl = this.makeCreateElement(
        this.getStyles(name, { [name]: style })
      )
      return ({ getRef, ...props }) => createEl(name, { ref: getRef, ...props })
    }

    let themes
    if (Child.theme) {
      themes = this.getStyles('theme', Child.theme)
      console.log('themes', themes)
    }

    // class
    if (Child.prototype) {
      // shim this.makeCreateElementement
      Child.prototype.glossElement = this.makeCreateElement(
        this.getStyles(Child.name, Child.style)
      )

      const ogWillReceiveProps = Child.prototype.componentWillReceiveProps
      Child.prototype.componentWillReceiveProps = function(nextProps, ...args) {
        if (Child.theme) {
          console.log('nextProps', nextProps, themes)
          // this.theme = getThemes(staticThemes, dynamicThemes)
        }

        return ogWillReceiveProps.call(this, nextProps, ...args)
      }
    }

    return Child
  }

  applyNiceStyles = (styles: Object, errorMessage: string) => {
    for (const style in styles) {
      if (!styles.hasOwnProperty(style)) continue
      const value = styles[style]
      if (value) {
        styles[style] = this.niceStyle(value, errorMessage)
      }
    }
    return styles
  }

  getStyles = (name, style) => {
    const dynamicStyles = pickBy(style, isFunc)
    const staticStyles = pickBy(style, x => !isFunc(x))
    const niceStatics = this.applyNiceStyles(staticStyles, `${name}:`)
    const statics = StyleSheet.create(niceStatics)
    // attach key to status objects so we can use later in makeCreateElementement
    for (const key of Object.keys(statics)) {
      statics[key].key = key
    }
    return {
      statics,
      dynamics: dynamicStyles,
    }
  }
}

export default function glossFactory(options: Options): Function {
  return new Gloss(options)
}
