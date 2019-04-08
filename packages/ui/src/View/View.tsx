import { Col, gloss, GlossBaseProps } from '@o/gloss'
import { isDefined } from '@o/utils'
import { getSpaceSize, Sizes } from '../Space'
import { Omit } from '../types'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps, getElevation } from './elevate'

// TODO this gets messy, and is incomplete
type CommonHTMLProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | 'title'
  | 'about'
  | 'accessKey'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'autoSave'
  | 'vocab'
  | 'typeof'
  | 'suppressHydrationWarning'
  | 'suppressContentEditableWarning'
  | 'spellCheck'
  | 'security'
  | 'slot'
  | 'results'
  | 'resource'
  | 'prefix'
  | 'property'
  | 'radioGroup'
  | 'dangerouslySetInnerHTML'
  | 'contextMenu'
  | 'dir'
  | 'datatype'
  | 'inlist'
  | 'itemID'
  | 'lang'
  | 'is'
  | 'itemScope'
  | 'inputMode'
>

export type ViewProps = CommonHTMLProps &
  GlossBaseProps &
  CommonViewProps &
  ElevatableProps &
  PaddedProps

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
          padding: [x, y, x, y].map(val => getSpaceSize(val)),
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

export function getBetweenPad(pad: PaddedProps['pad']): Sizes {
  if (Array.isArray(pad)) {
    return pad[0] || 0
  }
  if (!pad) {
    return 0
  }
  if (typeof pad === 'object') {
    return pad.top || pad.y || 0
  }
  return pad
}

export const View = gloss<ViewProps>(Col).theme(getPadding, getElevation)
