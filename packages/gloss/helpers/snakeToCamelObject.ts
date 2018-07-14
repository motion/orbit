import { snakeToCamel } from '@mcro/css'

// Fast object reduce
export function snakeToCamelObject(style) {
  let newStyle = {}
  for (const name of Object.keys(style)) {
    if (name.indexOf('-')) {
      newStyle[snakeToCamel(name)] = style[name]
    } else {
      newStyle[name] = style[name]
    }
  }
  return newStyle
}
