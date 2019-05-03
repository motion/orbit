import { gloss } from '@o/gloss'

import { isBrowser } from './constants'
import { useScale } from './Scale'

// we need just a touch of css
if (isBrowser) {
  require('./Space.css')
}

export type Sizes =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | number
  | boolean
  | undefined
  | string

export type SpaceProps = {
  size?: Sizes
}

export const spaceSizes = {
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
  if (!space || space === true) {
    space = 'md'
  }
  return spaceSizes[space] || space || 0
}

export const Space = gloss<SpaceProps>()
  .theme((props: SpaceProps) => {
    const size = getSpaceSize(props.size) * useScale()
    return {
      width: size,
      height: size,
      ...props,
    }
  })
  .withConfig({
    defaultProps: {
      className: 'ui-space',
    },
  })

// @ts-ignore
Space.isSpace = true
