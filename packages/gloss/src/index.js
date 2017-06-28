// @flow
import glossyElFactory from './fancyElement'
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

  constructor(options: Options = DEFAULT_OPTS) {
    this.options = options
    this.motionStyle = motionStyle(options)
    this.baseStyles =
      options.baseStyles &&
      this.getStyles(
        { name: 'Gloss Parent Styles', style: this.options.baseStyles },
        null
      )
    this.glossyEl = (styles, theme) =>
      glossyElFactory(
        theme,
        this.baseStyles,
        styles,
        this.options,
        this.applyNiceStyles
      )
    this.createElement = this.glossyEl(
      this.getStyles({ name: 'root', style: {} })
    )
    // allow grabbing createElement off decorator
    this.decorator.createElement = this.createElement
  }

  decorator = (Child: Function | string, style: ?Object) => {
    // shorthand
    if (typeof Child === 'string') {
      const name = Child
      const createEl = this.glossyEl(
        this.getStyles({ name, style: { [name]: style } })
      )
      return ({ getRef, ...props }) => createEl(name, { ref: getRef, ...props })
    }

    // class
    if (Child.prototype) {
      // shim this.glossyElement
      Child.prototype.glossElement = this.glossyEl(
        this.getStyles(Child, this.options.dontTheme ? null : Child.theme),
        Child.theme
      )

      // const ogRender = Child.prototype.render
      // Child.prototype.render = function(...args) {
      //   return ogRender.call(this, ...args)
      // }
    }

    return Child
  }

  applyNiceStyles = (styles: Object, errorMessage: string) => {
    for (const style in styles) {
      if (!styles.hasOwnProperty(style)) {
        continue
      }
      const value = styles[style]
      if (value) {
        styles[style] = this.motionStyle(value, errorMessage)
      }
    }
    return styles
  }

  getStyles = (
    { name, style }: { name: string, style: Object },
    theme: ?Object
  ) => {
    const styles = { ...style, ...flattenThemes(theme) }
    const dynamicStyles = pickBy(styles, isFunc)
    const staticStyles = pickBy(styles, x => !isFunc(x))
    const niceStatics = this.applyNiceStyles(staticStyles, `${name}:`)
    const statics = StyleSheet.create(niceStatics)
    // attach key to status objects so we can use later in glossyElement
    for (const key of Object.keys(statics)) {
      statics[key].key = key
    }
    return {
      statics,
      dynamics: dynamicStyles,
      theme,
    }
  }
}

export default function glossFactory(options: Options): Function {
  return new Gloss(options)
}
