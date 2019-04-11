import { gloss } from '@o/gloss'
import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  alpha: 0.85,
  lineHeight: '1.4rem',
  userSelect: 'text',
  display: 'block',
})

Paragraph.defaultProps = {
  // why
  margin: [0, 0, '1rem'],
}
