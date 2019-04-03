import { gloss } from '@o/gloss'
import { Text } from './Text'

export const Message = gloss(Text, {
  lineHeight: '1.4rem',
  cursor: 'text',
  whiteSpace: 'normal',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  padding: [10, 10],
}).theme((_, theme) => ({
  background: theme.backgroundZebra || theme.background,
  color: theme.color,
}))

Message.defaultProps = {
  className: 'text',
}
