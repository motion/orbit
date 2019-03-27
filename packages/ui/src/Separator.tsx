import { gloss } from '@o/gloss'
import { Text } from './text/Text'

export const Separator = gloss(Text, {
  paddingTop: 18,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 2,
  opacity: 0.6,
})

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
