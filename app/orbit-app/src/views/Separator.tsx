import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

export const Separator = view(Text, {
  padding: [2, 12],
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(0.2),
}))

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
