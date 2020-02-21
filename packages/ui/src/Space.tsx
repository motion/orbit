import { Box, gloss, ThemeValue } from 'gloss'

import { isBrowser } from './constants'
import { mediaQueryKeysSize } from './mediaQueryKeys'

// we need just a touch of css to collapse multiple spaces nicely
if (isBrowser) {
  require('../Space.css')
}

export type SizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
export type Size = SizeName | number | boolean | void | string
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

export function getSpaceSize(space: Size | ThemeValue<Size>, scale: number = 1): number | string {
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

const getScaledSize = (dim: number | string) => {
  return typeof dim === 'string' ? dim : `calc(${dim}px * var(--scale))`
}

export const Space = gloss<SpaceProps>(Box, {
  size: 'md',
  className: 'ui-space',
}).theme(props => {
  const size = props.size
  const dim = getScaledSize(getSpaceSize(size))
  // support media query spaces
  let mediaQueryStyles = null
  for (const key in props) {
    if (key in mediaQueryKeysSize) {
      const val = props[key]
      const mediaDim = getScaledSize(getSpaceSize(val))
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
  }
})

// @ts-ignore
Space.isSpace = true
