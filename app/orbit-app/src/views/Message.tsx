import { view } from '@mcro/black'

// @ts-ignore
export const Message = view('p', {
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

// @ts-ignore
export const MessageDark = view('p', {
  fontSize: 15,
  lineHeight: '1.2rem',
  cursor: 'text',
  // theres a weird glitchy thing that happens when trying to select this
  userSelect: 'none',
  display: 'block',
  width: '100%',
  borderRadius: 8,
  border: [1, [0, 0, 0, 0.15]],
  background: [0, 0, 0, 0.1],
  padding: [10, 10],
  margin: [0, 0, 20],
  color: [255, 255, 255, 0.95],
})
