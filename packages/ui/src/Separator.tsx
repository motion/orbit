import { gloss } from 'gloss'

import { Text, TextProps } from './text/Text'

export type SeparatorProps = TextProps

export const Separator = gloss<SeparatorProps>(Text, {
  paddingTop: 24,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 4,
  opacity: 0.6,
})

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
