import {
  COLOR_KEYS,
  FALSE_VALUES,
  psuedoKeys,
  SHORTHANDS,
  UNDEFINED,
  unitlessNumberProperties,
} from './constants'
import { CAMEL_TO_SNAKE } from './cssNameMap'
import { processArray, processObject, px } from './helpers'
import { toColor } from './toColor'
import { LinearGradient } from './utils/LinearGradient'

export * from './colorHelpers'
// exports
export { configureCSS } from './config'
export { psuedoKeys, validCSSAttr } from './constants'
export { CSSPropertySet, CSSPropertySetStrict } from './cssPropertySet'
export * from './helpers'
export { camelToSnake, snakeToCamel } from './helpers'
export { Color, ThemeObject, Transform } from './types'
export { LinearGradient } from './utils/LinearGradient'

export type CSSOptions = {
  errorMessage?: string
  snakeCase?: boolean
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
    let finalKey = key
    // convert camel to snake
    if (shouldSnake) {
      finalKey = CAMEL_TO_SNAKE[key] || key
    }
    // get real values
    if (value === false) {
      value === FALSE_VALUES[key]
      valueType = typeof value
    }
    // simple syles
    if (valueType === UNDEFINED || value === null || value === false) {
      continue
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
      toReturn[finalKey] = toColor(value)
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
      if (value instanceof LinearGradient) {
        toReturn[finalKey] = value.toString()
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
    throw new Error(
      `${(opts && opts.errorMessage) || 'Error'}: Invalid style value for ${key}: ${JSON.stringify(
        value,
      )}, in styles: ${JSON.stringify(styles)}`,
    )
  }

  return toReturn
}
