import { gloss, View } from '@o/gloss'
import { Text } from './Text'

export const Message = gloss(Text, {
  lineHeight: '1.4rem',
  cursor: 'text',
  // theres a weird glitchy thing that happens when trying to select this
  userSelect: 'none',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  padding: [10, 10],
}).theme((_, theme) => ({
  background: theme.backgroundAlternate || theme.background,
  color: theme.color,
}))

Message.defaultProps = {
  className: 'text',
}

export const MessageDark = gloss(View, {
  fontSize: 16,
  lineHeight: '1.3rem',
  cursor: 'text',
  // theres a weird glitchy thing that happens when trying to select this
  userSelect: 'none',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  border: [1, [0, 0, 0, 0.15]],
  background: [0, 0, 0, 0.1],
  padding: [16, 16],
  margin: [0, 0, 20],
  color: [255, 255, 255, 0.95],
})
