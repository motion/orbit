import { gloss } from '@o/gloss'
import { View } from './View/View'

export type Sizes = 'sm' | 'md' | 'lg' | 'xl' | number | true

export type SpaceProps = {
  space?: Sizes
}

const spaceSizes = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export function getSpaceSize(space: SpaceProps['space']) {
  if (typeof space === 'number') {
    return space
  }
  if (typeof space === 'undefined' || space === true) {
    space = 'md'
  }
  return spaceSizes[space]
}

function spaceTheme(props) {
  const spacing = getSpaceSize(props)
  return {
    width: spacing,
    height: spacing,
  }
}

export const Space = gloss<SpaceProps>(View).theme(spaceTheme)
