import { selectDefined } from '@o/utils'
import { gloss } from 'gloss'

import { isBrowser } from './constants'
import { sizeMediaQueryKeys } from './mediaQueryKeys'
import { useScale } from './Scale'
import { View } from './View/View'

// we need just a touch of css to collapse multiple spaces nicely
if (isBrowser) {
  require('./Space.css')
}

export type Size =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | number
  | boolean
  | void
  | string

export type Sizes = Size | Size[]

export type SpaceProps = {
  size?: Size
  scale?: number
  flex?: number
  // support media query style props sm-size, etc
  [key: string]: any
}

export const spaceSizes = {
  xxxs: 1,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
}

export function getSpaceSize(space: Size, scale: number = 1): number | string {
  if (typeof space === 'number') {
    return space * scale
  }
  if (space === false) {
    return 0
  }
  if (typeof space === 'string') {
    if (spaceSizes[space]) {
      return spaceSizes[space] * scale
    }
    return space
  }
  return spaceSizes.md * scale
}

export function getSpaceSizeNum(space: Size, scale: number = 1): number {
  return +getSpaceSize(space, scale)
}

export function getSpacesSize(space: Sizes, scale: number = 1) {
  if (Array.isArray(space)) {
    return space.map(x => +getSpaceSize(x, scale))
  }
  return getSpaceSize(space)
}

export const Space = gloss<SpaceProps>(View)
  .theme(({ size, scale = 1, ...rest }) => {
    scale = selectDefined(scale, useScale())
    const dim = getSpaceSize(size, scale)
    // support media query spaces
    let mediaQueryStyles = null
    for (const key in rest) {
      if (key in sizeMediaQueryKeys) {
        const val = rest[key]
        const mediaDim = getSpaceSize(val, scale)
        const mediaKey = key.replace('-size', '')
        mediaQueryStyles = mediaQueryStyles || {}
        mediaQueryStyles[`${mediaKey}-width`] = mediaDim
        mediaQueryStyles[`${mediaKey}-height`] = mediaDim
      }
    }
    return {
      width: dim,
      height: dim,
      ...mediaQueryStyles,
      ...rest,
    }
  })
  .withConfig({
    defaultProps: {
      className: 'ui-space',
    },
  })

// @ts-ignore
Space.isSpace = true
