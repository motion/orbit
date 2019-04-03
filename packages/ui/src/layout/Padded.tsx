import { CSSPropertySet, gloss, View, ViewProps } from '@o/gloss'

export type PaddedProps = {
  padded?: boolean
  padding?: CSSPropertySet['padding']
}

export const Padded = gloss<PaddedProps & ViewProps>(View, {
  overflow: 'hidden',
  flex: 1,
  flexFlow: 'inherit',
  padded: {
    padding: 20,
  },
})
