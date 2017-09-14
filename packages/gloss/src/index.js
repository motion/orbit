// @flow
import fancyElement from './fancyElement'
import motionStyle from '@mcro/css'
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

const DEFAULT_OPTS = {
  themeKey: 'theme',
}

function uid() {
  return `g${Math.random()
    .toString()
    .replace('.', '')
    .slice(0, 15)}`
}

export class Gloss {
  options: Options
  niceStyle: any
  baseStyles: ?Object
  createElement: Function
  Helpers: Object = Helpers
  attachedStyles: Object = {}

  constructor(opts: Options = DEFAULT_OPTS) {
    this.options = opts
    this.niceStyle = motionStyle(opts)
    this.helpers = this.niceStyle.helpers
    this.stylesheet = JSS.createStyleSheet()
    this.stylesheet.attach()
    this.baseStyles = this.attachStyles(false, opts.baseStyles)
    this.createElement = fancyElement(this, this.stylesheet)
    this.decorator.createElement = this.createElement
  }

  decorator = (Child: Function | string) => {
    if (Child.prototype) {
      const { attachStyles, applyStyles, niceStyle } = this

      Child.prototype.glossElement = this.createElement
      Child.prototype.gloss = this
      Child.prototype.glossStylesheet = this.stylesheet

      // on first mount, attach styles
      const ogComponentWillMount = Child.prototype.componentWillMount
      Child.prototype.componentWillMount = function(...args) {
        if (!Child.glossUID) {
          Child.glossUID = uid()
          attachStyles(Child.glossUID, Child.style)
        }
        if (ogComponentWillMount) {
          return ogComponentWillMount.call(this, ...args)
        }
      }

      const hasTheme = Child.theme && typeof Child.theme === 'function'

      if (!hasTheme) {
        return Child
      }

      if (!Child.prototype.theme) {
        const ogRender = Child.prototype.render
        Child.prototype.render = function(...args) {
          let activeTheme
          const { theme } = this.props
          if (typeof theme === 'object') {
            activeTheme = { base: theme }
          } else {
            activeTheme =
              this.context.uiThemes &&
              this.context.uiThemes[theme || this.context.uiActiveThemeName]
          }
          if (activeTheme) {
            const childTheme = Child.theme(this.props, activeTheme, this)
            if (childTheme) {
              if (this.theme) {
                this.theme.detach()
              }
              this.theme = JSS.createStyleSheet(
                applyStyles(childTheme, (key, val) => niceStyle(val))
              ).attach()
            }
          }
          return ogRender.call(this, ...args)
        }
      }
    }
  }

  applyStyles = (styles: Object, getter: Function) => {
    return Object.keys(styles).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]:
          typeof styles[cur] === 'function'
            ? styles[cur]
            : getter(cur, styles[cur]),
      }),
      {}
    )
  }

  // runs niceStyleSheet on non-function styles
  attachStyles = (childKey, styles: any): void => {
    if (!styles) {
      return
    }
    return this.applyStyles(styles, (key, style) => {
      const stylesKey = childKey ? `${key}--${childKey}` : key
      if (!this.stylesheet.getRule(stylesKey)) {
        const niceStyle = this.niceStyle(style)
        return this.stylesheet.addRule(stylesKey, niceStyle)
      }
    })
  }
}

export default function glossFactory(options: Options): Gloss {
  return new Gloss(options)
}
