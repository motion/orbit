import { Base, BaseProps, gloss } from '@o/gloss'
import { ElevatableProps, getElevation } from './elevate'
import { getPadding, PadProps } from './PaddedView'

export type ViewProps = BaseProps &
  ElevatableProps &
  PadProps & {
    // could make this better done in terms of type flow, its for <Input labels...
    label?: React.ReactNode
  }

export const View = gloss<ViewProps>(Base, {
  display: 'flex',
}).theme(getPadding, getElevation)
