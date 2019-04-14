import { Base, gloss, GlossProps } from '@o/gloss'
import { Omit } from '../types'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps, getElevation } from './elevate'
import { getPadding, PadProps } from './PaddedView'

// TODO this gets messy, and is incomplete
// basic desire is to not overlap with CSS props
// and avoid clutter overall
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
  | 'contextMenu'
  | 'dir'
  | 'datatype'
  | 'inlist'
  | 'itemID'
  | 'lang'
  | 'is'
  | 'itemScope'
  | 'inputMode'
  | 'color'
>

export type ViewProps = GlossProps<CommonHTMLProps & CommonViewProps & ElevatableProps & PadProps>

export const View = gloss<ViewProps>(Base, {
  display: 'flex',
}).theme(getPadding, getElevation)
