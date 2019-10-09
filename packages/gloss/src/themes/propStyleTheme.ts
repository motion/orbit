import { CSSPropertySet, validCSSAttr } from '@o/css'

import { Config } from '../configureGloss'
import { ThemeFn } from '../gloss'

// resolves props into styles for valid css

export const propsToStyles: ThemeFn = (props) => {
  let styles: CSSPropertySet | null = null
  // loop over props turning into styles
  for (let key in props) {
    if (props?.ignorePropsToStyle?.has(key)) continue
    const next = propToStyle(key, props[key])
    if (next !== undefined)  {
      key = Config.pseudoAbbreviations?.[key] || key
      styles = styles || {}
      styles[key] = next
    }
  }
  return styles
}

export const propToStyle = (key: string, value: any) => {
  if (validCSSAttr[key]) {
    return value
  }

  // psuedos
  const abbrev = Config.pseudoAbbreviations?.[key] || null
  if (abbrev || key[0] === '&') {
    // adding psuedo styles, &:hover, etc
    const subStyle = value
    let val: CSSPropertySet | undefined
    // theme functions for sub objects
    for (const subKey in subStyle) {
      val = val || {}
      val[subKey] = subStyle[subKey]
    }
    return val
  }

  // media queries
  if (key !== 'data-is') {
    // TODO make this check if actually using media query key
    if (key.indexOf('-') > 0) {
      return value
    }
  }
}
