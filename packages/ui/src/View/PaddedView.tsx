import { Base, BaseProps, gloss } from '@o/gloss'
import { isDefined } from '@o/utils'
import { getSpaceSize, Sizes } from '../Space'

// Padded
export type PadProps = {
  pad?:
    | Sizes
    | Sizes[]
    | {
        top?: Sizes
        left?: Sizes
        bottom?: Sizes
        right?: Sizes
        x?: Sizes
        y?: Sizes
      }
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
  if (typeof props.pad !== 'undefined') {
    if (!props.pad) {
      return
    }
    if (Array.isArray(props.pad)) {
      return {
        padding: props.pad.map(x => getSpaceSize(x)),
      }
    }
    if (typeof props.pad === 'object') {
      const { top, left, right, bottom, x, y } = props.pad
      if (isDefined(x) || isDefined(y)) {
        return {
          padding: [x, y, x, y].map(val => getSpaceSize(val)),
        }
      }
      return {
        padding: [top, right, bottom, left].map(side => getSpaceSize(side || 0)),
      }
    }
    if (typeof props.pad === 'number' || typeof props.pad === 'string' || props.pad === true) {
      return {
        padding: getSpaceSize(props.pad),
      }
    }
  }
}

// plain padded view
export const PaddedView = gloss<BaseProps & PadProps>(Base, {
  width: '100%',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(getPadding)
