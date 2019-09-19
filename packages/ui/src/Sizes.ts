import { Size, SizeName, Sizes } from './Space'

const sizes = {
  xxxxs: 0.5,
  xxxs: 0.6,
  xxs: 0.7,
  xs: 0.8,
  sm: 0.9,
  md: 1,
  lg: 1.2,
  xl: 1.4,
  xxl: 1.6,
  xxxl: 1.8,
  xxxxl: 2,
}

export const getSize = (size: Sizes | Size): Sizes extends any[] ? number[] : number => {
  if (!size || size === true) return 1
  if (typeof size === 'string') return sizes[size]
  if (Array.isArray(size)) {
    return size.map(x => {
      return typeof x === 'number' ? x : +getSize(x)
    }) as any
  }
  return size
}

const textSizes = {
  xxxxs: 0.6,
  xxxs: 0.7,
  xxs: 0.8,
  xs: 0.9,
  sm: 1.0,
  md: 1.2,
  lg: 1.5,
  xl: 1.9,
  xxl: 2.4,
  xxxl: 3.0,
  xxxxl: 3.6,
}

// text should vary more
export const getTextSize = (size: Sizes) => {
  if (typeof size === 'string') return textSizes[size]
  return getSize(size)
}

const sizeKeys = Object.keys(sizes)

/**
 * Allows you to get a smaller/bigger size by string name.
 *
 * Examples:
 *  getSizeRelative('sm', -1) => 'xs'
 *  getSizeRelative('md', 3) => 'xxl'
 *
 * @param size the current size
 * @param adjustBy steps up/down the sizes
 */
export const getSizeRelative = (size: SizeName | number, adjustBy: number = 0): Size => {
  if (typeof size === 'number') {
    // for now a bit weak impl
    return size + adjustBy * 0.2
  }
  const curIndex = sizeKeys.indexOf(size)
  const nextIndex = Math.min(Math.max(0, curIndex + adjustBy), sizeKeys.length - 1)
  return sizeKeys[nextIndex]
}
