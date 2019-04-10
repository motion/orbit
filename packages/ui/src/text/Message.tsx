import { gloss } from '@o/gloss'
import { SimpleText } from './SimpleText'

// TODO accept size

export const Message = gloss(SimpleText, {
  userSelect: 'auto',
  lineHeight: '1.4rem',
  cursor: 'text',
  whiteSpace: 'normal',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  padding: 8,
}).theme((_, theme) => ({
  border: [1, theme.borderColor],
  background: theme.backgroundZebra || theme.background,
  color: theme.color,
}))

Message.defaultProps = {
  className: 'text',
}
