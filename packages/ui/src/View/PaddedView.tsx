import { gloss } from 'gloss'

import { getPadding, PadProps } from './pad'
import { View, ViewProps } from './View'

// plain padded view
export const PaddedView = gloss<ViewProps & PadProps>(View, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  flex: 1,
  alignItems: 'inherit',
  justifyContent: 'inherit',
  overflow: 'inherit',
  minWidth: '100%',
}).theme(getPadding)
