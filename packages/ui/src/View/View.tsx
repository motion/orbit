import { Base, BaseProps, gloss } from '@o/gloss'

import { Sizes } from '../Space'
import { ElevatableProps, getElevation } from './elevate'
import { getPadding, getSizableValue, PadProps, SizesObject } from './PaddedView'

export type ViewProps = BaseProps &
  ElevatableProps &
  MarginProps &
  PadProps & {
    // could make this better done in terms of type flow, its for <Input labels...
    label?: React.ReactNode
  }

export const View = gloss<ViewProps>(Base, {
  display: 'flex',
}).theme(getMargin, getPadding, getElevation)

// margin

export type MarginProps = {
  margin?: Sizes | Sizes[] | SizesObject
}

export function getMargin(props: MarginProps) {
  if (props.margin) {
    return { margin: getSizableValue(props.margin) }
  }
}
