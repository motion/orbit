import { gloss } from '@o/gloss'
import { SimpleText } from './SimpleText'

export const Message = gloss(SimpleText, {
  userSelect: 'auto',
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
