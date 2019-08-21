import { CSSPropertySet, ThemeObject, validCSSAttr } from '@o/css'

import { Config } from '../config'

export function styleVal(val: any, theme: ThemeObject, props?: Object) {
  return typeof val === 'function' ? val(theme, props) : val
}

// resolves props into styles for valid css

export function propStyleTheme(props: any, theme: ThemeObject): CSSPropertySet | null {
  let styles: CSSPropertySet | null = null
  // loop over props turning into styles
  for (let key in props) {
    if (validCSSAttr[key]) {
      const next = styleVal(props[key], theme, props)
      if (next !== undefined) {
        styles = styles || {}
        styles[key] = next
      }
      continue
    }
    // &:hover, etc
    const abbrev = Config.pseudoAbbreviations ? Config.pseudoAbbreviations[key] : null
    if (abbrev || key[0] === '&') {
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
    }
  }
  return styles
}
