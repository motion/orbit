import { Box, gloss } from 'gloss'

import { isBrowser } from './constants'
import { useScale } from './Scale'

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
  flex?: number
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

export const Space = gloss<SpaceProps>(Box)
  .theme(({ size, ...rest }: SpaceProps) => {
    const dim = getSpaceSize(size, useScale())
    return {
      width: dim,
      height: dim,
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
