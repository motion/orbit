import { view } from '@mcro/black'
import { View } from '@mcro/ui'

// @ts-ignore
export const Message = view(View, {
  fontSize: 16,
  lineHeight: '1.4rem',
  cursor: 'text',
  // theres a weird glitchy thing that happens when trying to select this
  userSelect: 'none',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  border: [1, [0, 0, 0, 0.035]],
  background: '#fff',
  padding: [10, 10],
  margin: [0, 0, 20],
  color: '#666',
})
Message.defaultProps = {
  tagName: 'p',
}

// @ts-ignore
export const MessageDark = view(View, {
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
