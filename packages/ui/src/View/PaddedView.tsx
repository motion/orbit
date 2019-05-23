import { gloss } from 'gloss'

import { getPadding, PadProps } from './pad'
import { View, ViewProps } from './View'

// plain padded view
export const PaddedView = gloss<ViewProps & PadProps>(View, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  flex: 'none',
  alignItems: 'inherit',
  justifyContent: 'inherit',
}).theme(getPadding)
