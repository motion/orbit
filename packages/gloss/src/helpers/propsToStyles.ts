import { CSSPropertySet, ThemeObject, validCSSAttr } from '@o/css'
import { Config } from '../config'
import { alphaColor } from './alphaColor'

export function styleVal(val: any, theme: ThemeObject, props?: Object) {
  return typeof val === 'function' ? val(theme, props) : val
}

// resolves props into styles for valid css

export function propsToStyles(props: any, theme: ThemeObject): CSSPropertySet {
  let styles: CSSPropertySet = {
    ...props.style,
  }
  // loop over props turning into styles
  for (let key in props) {
    // &:hover, etc
    const abbrev = Config.pseudoAbbreviations ? Config.pseudoAbbreviations[key] : null
    if (key[0] === '&' || abbrev) {
      const psuedoKey = abbrev || key
      const subStyle = props[key]
      const val = {}
      // theme functions for sub objects
      for (const subKey in subStyle) {
        val[subKey] = styleVal(subStyle[subKey], theme, props)
      }
      styles[psuedoKey] = val
    } else if (validCSSAttr[key]) {
      styles[key] = styleVal(props[key], theme, props)
    }
  }

  styles = alphaColor(styles, { alpha: props.alpha, alphaHover: props.alphaHover })

  return styles
}
