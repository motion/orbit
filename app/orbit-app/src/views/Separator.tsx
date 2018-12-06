import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

export const Separator = view(Text, {
  padding: [2, 12],
}).theme(props => ({
  background: props.theme.borderColor.alpha(0.2),
}))

Separator.defaultProps = {
  fontWeight: 400,
  size: 0.9,
}
