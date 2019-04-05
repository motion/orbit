import { Col, ColProps, gloss } from '@o/gloss'
import { isDefined } from '@o/utils'
import { getSpaceSize, Sizes } from '../Space'
import { ElevatableProps, getElevation } from './elevate'

export type ViewProps = ColProps & ElevatableProps & PaddedProps

// Padded

export type PaddedProps = {
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

const getPadding = (props: PaddedProps) => {
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
          padding: [x, y, x, y].map(x => getSpaceSize(x)),
        }
      }
      return {
        padding: [top, right, bottom, left].map(x => getSpaceSize(x)),
      }
    }
    if (typeof props.pad === 'number' || props.pad === true) {
      return {
        padding: getSpaceSize(props.pad),
      }
    }
  }
}

export function getBetweenPad(pad: PaddedProps['pad']) {
  if (Array.isArray(pad)) {
    return pad[0] || 0
  }
  if (pad && typeof pad === 'object') {
    return pad.top || pad.y || 0
  }
  return pad
}

export const View = gloss<ViewProps>(Col).theme(getPadding, getElevation)
