import { Col, gloss, GlossBaseProps } from '@o/gloss'
import { isDefined } from '@o/utils'
import { getSpaceSize, Sizes } from '../Space'
import { Omit } from '../types'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps, getElevation } from './elevate'

// TODO this gets messy, and is incomplete
export type CommonHTMLProps = Omit<
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
  PadProps

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

export const getPadding = (props: PadProps & { padding?: any }) => {
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
export const PaddedView = gloss({
  flexDirection: 'inherit',
}).theme(getPadding, props => props)

export function getBetweenPad(pad: PadProps['pad']): Sizes {
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
