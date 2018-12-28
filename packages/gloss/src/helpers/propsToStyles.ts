import { validCSSAttr, CSSPropertySet, ThemeObject } from '@mcro/css'
import { alphaColor } from './alphaColor'

export const styleVal = (val, theme) => (typeof val === 'function' ? val(theme) : val)

// resolves props into styles for valid css

export const propsToStyles = (props: any, theme: ThemeObject) => {
  const styles: CSSPropertySet = {
    ...props.style,
  }
  // loop over props turning into styles
  for (const key in props) {
    // &:hover, etc
    if (key[0] === '&') {
      const val = {}
      // theme functions for sub objects
      for (const subKey in props[key]) {
        val[subKey] = styleVal(props[key][subKey], theme)
      }
      styles[key] = val
    } else if (validCSSAttr[key]) {
      styles[key] = styleVal(props[key], theme)
    }
  }
  return alphaColor(styles, { alpha: props.alpha, alphaHover: props.alphaHover })
}
