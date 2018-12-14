import { GLOSS_IGNORE_COMPONENT_SYMBOL } from '../symbols'

export const colorToString = (obj: any) => {
  const { model, color, valpha } = obj
  const hasAlpha = typeof valpha === 'number' && valpha !== 1
  if (model === 'rgb') {
    const inner = `${color[0]}, ${color[1]}, ${color[2]}`
    if (hasAlpha) {
      return `rgba(${inner}, ${valpha})`
    }
    return `rgb(${inner})`
  }
  if (model === 'hsl') {
    const inner = `${color[0]}, ${Math.round(color[1])}%, ${Math.round(color[2])}%`
    if (hasAlpha) {
      return `hsla(${inner}, ${valpha})`
    }
    return `hsl(${inner})`
  }
  return obj.toString()
}

const isGlossFirstArg = (a: any) =>
  typeof a === 'undefined' || typeof a === 'string' || typeof a === 'object'

export const isGlossArguments = (a: any, b: any) => {
  if (b && b[GLOSS_IGNORE_COMPONENT_SYMBOL]) {
    return false
  }
  if (typeof a === 'function' && typeof b === 'object') {
    return true
  }
  return isGlossFirstArg(a)
}
