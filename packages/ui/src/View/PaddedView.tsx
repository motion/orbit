import { gloss } from 'gloss'

import { getPadding, PadProps } from './pad'
import { View, ViewProps } from './View'

// plain padded view
export const PaddedView = gloss<ViewProps & PadProps>(View, {
  width: '100%',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  flex: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
}).theme(getPadding)
