import { CSSPropertySet, gloss } from '@o/gloss'
import { View, ViewProps } from './View/View'

export type PaddedProps = {
  padded?: boolean
  padding?: CSSPropertySet['padding']
}

export const Padded = gloss<PaddedProps & ViewProps>(View, {
  flex: 1,
  flexFlow: 'inherit',
  padded: {
    padding: 20,
  },
})
