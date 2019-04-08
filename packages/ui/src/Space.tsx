import { gloss } from '@o/gloss'

export type Sizes = 'sm' | 'md' | 'lg' | 'xl' | number | boolean | undefined

export type SpaceProps = {
  size?: Sizes
}

export const spaceSizes = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
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
  return spaceSizes[space] || 0
}

export const Space = gloss<SpaceProps>().theme((props: SpaceProps) => {
  const spacing = getSpaceSize(props.size)
  return {
    width: spacing,
    height: spacing,
  }
})
