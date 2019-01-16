import { Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const Separator = gloss(Text, {
  padding: [8, 12, 2],
  opacity: 0.5,
})
// .theme((_, theme) => ({
//   background: theme.borderColor.alpha(0.08),
// }))

Separator.defaultProps = {
  fontWeight: 600,
  size: 0.95,
  alpha: 0.7,
}
