import { CSSPropertySet, ThemeObject, validCSSAttr } from '@o/css'

import { Config } from '../configureGloss'

export function styleVal(val: any, theme: ThemeObject, props?: Object) {
  return typeof val === 'function' ? val(theme, props) : val
}

// resolves props into styles for valid css

export function propStyleTheme(props: any, theme: ThemeObject): CSSPropertySet | null {
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
    } else if (key[2] === '-' || key[3] === '-') {
      // adding mediaQueries keys
      styles = styles || {}
      styles[key] = styleVal(props[key], theme, props)
    }
  }
  return styles
}
