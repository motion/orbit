import { gloss } from '@o/gloss'

export type Sizes = 'sm' | 'md' | 'lg' | 'xl' | number | boolean

export type SpaceProps = {
  space?: Sizes
}

export const spaceSizes = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

// indent 1-4 maps to sm-xl
export function getIndentSize(size: number) {
  const key = Object.keys(spaceSizes)[size]
  return key ? spaceSizes[key] : 0
}

export function getSpaceSize(space: Sizes) {
  if (!space) {
    return 0
  }
  if (typeof space === 'number') {
    return space
  }
  if (typeof space === 'undefined' || space === true) {
    space = 'md'
  }
  return spaceSizes[space] || 0
}

function spaceTheme(props: SpaceProps) {
  const spacing = getSpaceSize(props.space)
  return {
    width: spacing,
    height: spacing,
  }
}

export const Space = gloss<SpaceProps>().theme(spaceTheme)
