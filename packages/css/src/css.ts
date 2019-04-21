import { toColorString } from '@o/color'

import { COLOR_KEYS, FALSE_VALUES, psuedoKeys, SHORTHANDS, unitlessNumberProperties } from './constants'
import { CAMEL_TO_SNAKE } from './cssNameMap'
import { processArray, processObject, px } from './helpers'

// exports

export * from '@o/color'
export { configureCSS } from './config'
export { psuedoKeys, validCSSAttr } from './constants'
export { CSSPropertySet, CSSPropertySetResolved, CSSPropertySetStrict } from './cssPropertySet'
export * from './helpers'
export { camelToSnake, snakeToCamel } from './helpers'
export { ThemeObject, ThemeSet } from './ThemeObject'
export { Transform } from './types'

export type CSSOptions = {
  errorMessage?: string
  snakeCase?: boolean
}

export function toCSSString(styles: Object, opts?: CSSOptions): string {
  const obj = css(styles, opts)
  let s = ''
  for (const key in obj) {
    s += `${key}: ${obj[key]};`
  }
  return s
}

export function css(styles: Object, opts?: CSSOptions): Object {
  const toReturn: any = {}
  const shouldSnake = !opts || opts.snakeCase !== false
  if (!styles || typeof styles !== 'object') {
    return toReturn
  }

  for (let key in styles) {
    let value = styles[key]
    let valueType = typeof value
    // get real values
    if (value === false) {
      value === FALSE_VALUES[key]
      valueType = typeof value
    }

    // remove nullish
    if (value === undefined || value === null || value === false) {
      continue
    }

    let finalKey = key
    // convert camel to snake
    if (shouldSnake) {
      finalKey = CAMEL_TO_SNAKE[key] || key
    }
    let respond
    const firstChar = key[0]
    if (valueType === 'string' || valueType === 'number') {
      if (valueType === 'number' && !unitlessNumberProperties.has(key)) {
        value += 'px'
      }
      toReturn[finalKey] = value
      respond = true
    } else if (COLOR_KEYS.has(key)) {
      toReturn[finalKey] = toColorString(value)
      respond = true
    } else if (Array.isArray(value)) {
      if (key === 'fontFamily') {
        toReturn[finalKey] = value.map(x => (x.indexOf(' ') ? `"${x}"` : x)).join(', ')
      } else if (key === 'position') {
        const isSpecific = value.length === 5
        let index = 0
        if (isSpecific) {
          toReturn.position = value[0]
          index++
        } else {
          toReturn.position = 'absolute'
        }
        toReturn.top = px(value[index++])
        toReturn.right = px(value[index++])
        toReturn.bottom = px(value[index++])
        toReturn.left = px(value[index++])
      } else {
        toReturn[finalKey] = processArray(key, value)
      }
      respond = true
    } else if (
      firstChar === '&' ||
      firstChar === '@' ||
      key === 'from' ||
      key === 'to' ||
      psuedoKeys[key]
    ) {
      // recurse into psuedo or media query
      toReturn[finalKey] = css(value, opts)
      respond = true
    } else if (valueType === 'object') {
      if (value.toCSS) {
        toReturn[finalKey] = value.toCSS()
        continue
      }
      // not react element
      if (value['$$typeof'] === Symbol.for('react.element')) {
        continue
      }
      toReturn[finalKey] = processObject(key, value)
      respond = true
    } else if (key === 'isolate') {
      toReturn[key] = value
      respond = true
    }
    // shorthands
    if (SHORTHANDS[key]) {
      for (let k of SHORTHANDS[key]) {
        k = shouldSnake ? CAMEL_TO_SNAKE[k] || k : k
        toReturn[k] = px(value)
      }
    }
    if (respond) {
      continue
    }
    console.warn(
      `${(opts && opts.errorMessage) || 'Error'}: Invalid style value for ${key}: ${JSON.stringify(
        value,
      )}, in styles: ${JSON.stringify(styles)}`,
    )
  }

  return toReturn
}
