import { CSSPropertySet, ThemeObject, validCSSAttr } from '@mcro/css'
import { Config } from '../config'
import { alphaColor } from './alphaColor'

export const styleVal = (val, theme) => (typeof val === 'function' ? val(theme) : val)

// resolves props into styles for valid css

export const propsToStyles = (props: any, theme: ThemeObject) => {
  const styles: CSSPropertySet = {
    ...props.style,
  }
  // loop over props turning into styles
  for (let key in props) {
    // &:hover, etc
    const abbrev = Config.pseudoAbbreviations[key]
    if (key[0] === '&' || abbrev) {
      const psuedoKey = abbrev || key
      const subStyle = props[key]
      const val = {}
      // theme functions for sub objects
      for (const subKey in subStyle) {
        val[subKey] = styleVal(subStyle[subKey], theme)
      }
      styles[psuedoKey] = val
    } else if (validCSSAttr[key]) {
      styles[key] = styleVal(props[key], theme)
    }
  }
  return alphaColor(styles, { alpha: props.alpha, alphaHover: props.alphaHover })
}
