import { Sizes } from './Space'

const sizes = {
  xs: 0.8,
  sm: 0.9,
  md: 1,
  lg: 1.2,
  xl: 1.4,
  xxl: 1.6,
  xxxl: 1.8,
}

export const getSize = (size: Sizes): Sizes extends any[] ? number[] : number => {
  if (!size || size === true) return 1
  if (typeof size === 'string') return sizes[size]
  const scl = 0.75
  if (Array.isArray(size)) {
    return size.map(x => {
      return (typeof x === 'number' ? x : +getSize(x)) * scl
    }) as any
  }
  if (size * scl <= 1) return size
  return size * scl
}

const textSizes = {
  xxxs: 0.6,
  xxs: 0.7,
  xs: 0.8,
  sm: 1.0,
  md: 1.2,
  lg: 1.8,
  xl: 2.0,
  xxl: 2.4,
  xxxl: 3.0,
}

// text should vary more
export const getTextSize = (size: Sizes) => {
  if (typeof size === 'string') return textSizes[size]
  return getSize(size)
}
