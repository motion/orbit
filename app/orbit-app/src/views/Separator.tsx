import { Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const Separator = gloss(Text, {
  padding: [6, 12, 2],
})
// .theme((_, theme) => ({
//   background: theme.borderColor.alpha(0.08),
// }))

Separator.defaultProps = {
  fontWeight: 600,
  size: 0.9,
  alpha: 0.7,
}
