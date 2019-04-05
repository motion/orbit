import { gloss } from '@o/gloss'

const presetSizes = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const Space = gloss<{ size?: 'sm' | 'md' | 'lg' | 'xl' | number }>().theme(({ size }) => {
  if (typeof size === 'undefined') {
    size = 'sm'
  }
  if (presetSizes[size]) {
    return {
      width: presetSizes[size],
      height: presetSizes[size],
    }
  }
  return {
    width: size,
    height: size,
  }
})
