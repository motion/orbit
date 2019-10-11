import { CSSPropertySet, validCSSAttr } from '@o/css'

import { ThemeFn } from '../gloss'

// resolves props into styles for valid css

export const propsToStyles: ThemeFn = (props) => {
  let styles: CSSPropertySet | null = null
  // loop over props turning into styles
  for (let key in props) {
    if (props?.ignorePropsToStyle?.[key]) continue
    const next = propToStyle(key, props[key])
    if (next !== undefined)  {
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
  if (key[0] === '&') {
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
