import { Base, BaseProps, gloss } from '@o/gloss'
import { Omit } from '../types'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps, getElevation } from './elevate'
import { getPadding, PadProps } from './PaddedView'

export type ViewProps = BaseProps &
  Omit<CommonViewProps, 'background'> &
  ElevatableProps &
  PadProps & {
    // could make this better done in terms of type flow, its for <Input labels...
    label?: React.ReactNode
  }

export const View = gloss<ViewProps>(Base, {
  display: 'flex',
}).theme(getPadding, getElevation)
