import { isDefined } from '@o/utils'

import { getSpaceSize, Sizes } from '../Space'
import { SizesObject } from './types'

export const getSizableValue = (
  value: Sizes | SizesObject | null | undefined,
): string | number | (number | string)[] => {
  if (value) {
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
