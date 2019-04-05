import { gloss } from '@o/gloss'
import { View } from './View/View'

export type SpacingProps = {
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | number | true
}

const spaceSizes = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export function getSpacing(spacing: SpacingProps['spacing']) {
  if (typeof spacing === 'number') {
    return spacing
  }
  if (typeof spacing === 'undefined' || spacing === true) {
    spacing = 'md'
  }
  return spaceSizes[spacing]
}

function getSpacingSize(props) {
  const spacing = getSpacing(props)
  return {
    width: spacing,
    height: spacing,
  }
}

export const Space = gloss<SpacingProps>(View).theme(getSpacingSize)
