import { Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const Separator = gloss(Text, {
  padding: [10, 10, 2],
  opacity: 0.65,
})
// .theme((_, theme) => ({
//   background: theme.borderColor.alpha(0.08),
// }))

Separator.defaultProps = {
  fontWeight: 700,
  size: 0.95,
}
