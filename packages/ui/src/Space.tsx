import { Box, gloss } from 'gloss'

import { isBrowser } from './constants'
import { useScale } from './Scale'

// we need just a touch of css
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
  size?: Sizes
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

export function getSpaceSize(space: Sizes) {
  if (space === 0) {
    return 0
  }
  if (typeof space === 'number') {
    return space
  }
  if (space === false) {
    return 0
  }
  if (!space || space === true) {
    space = 'md'
  }
  if (Array.isArray(space)) {
    return space.map(getSpaceSize)
  }
  return spaceSizes[space] || space || 0
}

export const Space = gloss<SpaceProps>(Box)
  .theme(({ size, ...rest }: SpaceProps) => {
    const dim = getSpaceSize(size) * useScale()
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
