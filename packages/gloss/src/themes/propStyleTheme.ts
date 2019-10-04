import { CSSPropertySet, validCSSAttr } from '@o/css'

import { Config } from '../configureGloss'
import { CompiledTheme } from '../theme/createTheme'

export function styleVal(val: any, theme: CompiledTheme, props?: Object) {
  return typeof val === 'function' ? val(theme, props) : val
}

// resolves props into styles for valid css

export function propsToStyles(props: any, theme: CompiledTheme): CSSPropertySet | null {
  let styles: CSSPropertySet | null = null
  // loop over props turning into styles
  for (let key in props) {
    if (validCSSAttr[key]) {
      // add valid css attributes
      const next = styleVal(props[key], theme, props)
      if (next !== undefined) {
        styles = styles || {}
        styles[key] = next
      }
      continue
    }

    // psuedos
    const abbrev = Config.pseudoAbbreviations ? Config.pseudoAbbreviations[key] : null
    if (abbrev || key[0] === '&') {
      // adding psuedo styles, &:hover, etc
      const psuedoKey = abbrev || key
      const subStyle = props[key]
      let val: CSSPropertySet | undefined
      // theme functions for sub objects
      for (const subKey in subStyle) {
        val = val || {}
        val[subKey] = styleVal(subStyle[subKey], theme, props)
      }
      if (val) {
        styles = styles || {}
        styles[psuedoKey] = val
      }
      continue
    }

    // media queries
    if (key === 'data-is') continue // we set this, avoid work
    // TODO make this check if actually using media query key
    if (key.indexOf('-') > 0) {
      // adding mediaQueries keys
      styles = styles || {}
      styles[key] = styleVal(props[key], theme, props)
    }
  }
  return styles
}
