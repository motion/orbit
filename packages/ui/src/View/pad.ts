import { isDefined } from '@o/utils'

import { useScale } from '../Scale'
import { getSpaceSize, Sizes } from '../Space'

export type SizesObject = {
  top?: Sizes
  left?: Sizes
  bottom?: Sizes
  right?: Sizes
  x?: Sizes
  y?: Sizes
}

// Padded
export type PadProps = {
  pad?: Sizes | SizesObject
}

export const getPadding = (
  props: PadProps & {
    padding?: any
  },
) => {
  const scale = useScale()
  if (typeof props.padding !== 'undefined') {
    return {
      padding: props.padding,
    }
  }
  if (props.pad) {
    let padding = getSizableValue(props.pad)
    padding = Array.isArray(padding) ? padding.map(x => x * scale) : padding * scale
    return { padding }
  }
}

export const getSizableValue = (
  value: Sizes | SizesObject | null | undefined,
): number | number[] => {
  if (typeof value !== 'undefined') {
    if (!value) {
      return
    }
    if (Array.isArray(value)) {
      return getSpaceSize(value)
    }
    if (typeof value === 'object') {
      const { top, left, right, bottom, x, y } = value
      if (isDefined(x) || isDefined(y)) {
        return [x, y, x, y].map(getSpaceSize)
      }
      return [top, right, bottom, left].map(side => getSpaceSize(side || 0))
    }
    if (typeof value === 'number' || typeof value === 'string' || value === true) {
      return getSpaceSize(value)
    }
  }
}
