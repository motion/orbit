import { isDefined, selectDefined } from '@o/utils'

import { useScale } from '../Scale'
import { getSpaceSize, getSpacesSize, Size, Sizes } from '../Space'

export type SizesObject = {
  top?: Size
  left?: Size
  bottom?: Size
  right?: Size
  x?: Size
  y?: Size
}

// Padded
export type PadProps = {
  pad?: Sizes | SizesObject
}

export const getPadding = (
  props: PadProps & {
    padding?: any
    paddingTop?: any
    paddingLeft?: any
    paddingRight?: any
    paddingBottom?: any
  },
) => {
  const scale = useScale()
  if (typeof props.padding !== 'undefined') {
    return {
      paddingTop: selectDefined(props.paddingTop, props.padding[0], props.padding),
      paddingRight: selectDefined(props.paddingRight, props.padding[1], props.padding),
      paddingBottom: selectDefined(
        props.paddingBottom,
        props.padding[2],
        props.padding[0],
        props.padding,
      ),
      paddingLeft: selectDefined(
        props.paddingLeft,
        props.padding[3],
        props.padding[1],
        props.padding,
      ),
    }
  }
  if (props.pad) {
    let padding = getSizableValue(props.pad)
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
}

export const getSizableValue = (
  value: Sizes | SizesObject | null | undefined,
): string | number | (number | string)[] => {
  if (typeof value !== 'undefined') {
    if (!value) return 0
    if (Array.isArray(value)) {
      return getSpacesSize(value)
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
