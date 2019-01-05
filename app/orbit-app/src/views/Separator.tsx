import { Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const Separator = gloss(Text, {
  padding: [2, 12],
}).theme((_, theme) => ({
  background: theme.background.alpha(0.2),
}))

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
