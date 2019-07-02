import { GlossPropertySet } from '@o/css'
import { isDefined, selectDefined } from '@o/utils'

import { useScale } from '../Scale'
import { getSpaceSize, Size, Sizes } from '../Space'

export type SizesObject = {
  top?: Size
  left?: Size
  bottom?: Size
  right?: Size
  x?: Size
  y?: Size
}

// Padded
export type PaddingProps = {
  padding?: Sizes | SizesObject | GlossPropertySet['padding']
}

export const usePadding = (
  props: PaddingProps & {
    paddingTop?: any
    paddingLeft?: any
    paddingRight?: any
    paddingBottom?: any
  },
) => {
  const scale = useScale()
  let padding = getSizableValue(props.padding)
  padding = Array.isArray(padding)
    ? padding.map(x => (typeof x === 'number' ? x * scale : x))
    : typeof padding === 'number'
    ? padding * scale
    : padding
  const paddingObj = {
    paddingTop: selectDefined(props.paddingTop, padding[0], padding),
    paddingRight: selectDefined(props.paddingRight, padding[1], padding),
    paddingBottom: selectDefined(props.paddingBottom, padding[2], padding[0], padding),
    paddingLeft: selectDefined(props.paddingLeft, padding[3], padding[1], padding),
  }
  return paddingObj
}

export const getSizableValue = (
  value: Sizes | SizesObject | null | undefined,
): string | number | (number | string)[] => {
  if (typeof value !== 'undefined') {
    if (!value) return 0
    if (Array.isArray(value)) {
      return value.map(x => getSpaceSize(x))
    }
    if (typeof value === 'object') {
      const { top, left, right, bottom, x, y } = value
      if (isDefined(x) || isDefined(y)) {
        return [x, y, x, y].map(x => getSpaceSize(x))
      }
      return [top, right, bottom, left].map(side => getSpaceSize(side || 0))
    }
    if (typeof value === 'number' || typeof value === 'string' || value === true) {
      return getSpaceSize(value)
    }
  }
  return 0
}
