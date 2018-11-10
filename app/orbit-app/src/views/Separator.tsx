import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

export const Separator = view(Text, {
  background: [100, 100, 100, 0.2],
  padding: [2, 12],
})

Separator.defaultProps = {
  fontWeight: 500,
}
