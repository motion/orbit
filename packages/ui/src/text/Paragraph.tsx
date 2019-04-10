import { gloss } from '@o/gloss'
import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  margin: [0, 0, '1rem'],
  alpha: 0.85,
  lineHeight: '1.4rem',
  userSelect: 'text',
})
