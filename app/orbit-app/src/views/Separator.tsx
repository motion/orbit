import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

export const Separator = view(Text, {
  padding: [1, 12],
}).theme(props => ({
  background: props.theme.background.alpha(0.4),
}))

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
