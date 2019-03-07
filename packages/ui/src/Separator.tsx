import { gloss } from '@o/gloss'
import { Text } from './text/Text'

export const Separator = gloss(Text, {
  padding: [18, 10, 2],
  opacity: 0.6,
})

Separator.defaultProps = {
  fontWeight: 700,
  size: 0.95,
}
