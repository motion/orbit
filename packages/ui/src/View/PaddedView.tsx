import { gloss } from '@o/gloss'
import { isDefined } from '@o/utils'

import { getSpaceSize, Sizes } from '../Space'
import { View, ViewProps } from './View'

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
  pad?: Sizes | Sizes[] | SizesObject
}

export const getPadding = (
  props: PadProps & {
    padding?: any
  },
) => {
  if (typeof props.padding !== 'undefined') {
    return {
      padding: props.padding,
    }
  }
  if (props.pad) {
    return { padding: getSizableValue(props.pad) }
  }
}

export const getSizableValue = (value: Sizes | SizesObject | Sizes[] | null | undefined) => {
  if (typeof value !== 'undefined') {
    if (!value) {
      return
    }
    if (Array.isArray(value)) {
      return value.map(x => getSpaceSize(x))
    }
    if (typeof value === 'object') {
      const { top, left, right, bottom, x, y } = value
      if (isDefined(x) || isDefined(y)) {
        return [x, y, x, y].map(val => getSpaceSize(val))
      }
      return [top, right, bottom, left].map(side => getSpaceSize(side || 0))
    }
    if (typeof value === 'number' || typeof value === 'string' || value === true) {
      return getSpaceSize(value)
    }
  }
}

// plain padded view
export const PaddedView = gloss<ViewProps & PadProps>(View, {
  width: '100%',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(getPadding)
