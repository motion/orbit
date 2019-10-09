import { Color } from './color'
import { getColorLikeLibraryValue, isColorLikeLibrary } from './isColorLike'
import { memoizeOne } from './memoizeOne'
import { ColorLike } from './types'

export const toColorString = memoizeOne<string>(
  (color: ColorLike): string => {
    if (typeof color === 'string') {
      return color
    }
    if (!color) {
      return 'transparent'
    }
    if (color instanceof Color) {
      if (color.cssVariable) {
        if (color.cssUseRgb) {
          if (color.cssUseAlpha) {
            return `rgba(var(--${color.cssVariable}-rgb), ${color.alpha})`
          }
        }
        return `var(--${color.cssVariable})`
      }
    }
    if (isColorLikeLibrary(color)) {
      return `${getColorLikeLibraryValue(color)}`
    }
    // final processing of objects and arrays
    if (Array.isArray(color)) {
      const length = color.length
      if (length === 4) {
        return `rgba(${color.join(', ')})`
      }
      if (length === 3) {
        return `rgb(${color.join(', ')})`
      }
    } else if (color instanceof Object) {
      // TODO improve types
      // @ts-ignore
      if (color.cssVariable) {
        // @ts-ignore
        return `var(--${color.cssVariable})`
      }
      const clr = color as any
      if (clr.a) {
        return `rgba(${clr.r}, ${clr.g}, ${clr.b}, ${clr.a})`
      }
      return `rgb(${clr.r}, ${clr.g}, ${clr.b})`
    }
    return color.toString()
  },
)
