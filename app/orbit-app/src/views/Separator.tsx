import { gloss } from '@mcro/gloss'
import { Text } from '@mcro/ui'

export const Separator = gloss(Text, {
  padding: [16, 10, 2],
  opacity: 0.655555222,
})
// .theme((_, theme) => ({
//   background: theme.borderColor.alpha(0.08),
// }))

Separator.defaultProps = {
  fontWeight: 700,
  size: 0.95,
}
