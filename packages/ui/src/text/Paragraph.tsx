import { gloss } from 'gloss'
import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  alpha: 0.85,
  userSelect: 'text',
  display: 'block',

  '& > img': {
    maxWidth: '100%',
  },
})

Paragraph.defaultProps = {
  sizeLineHeight: 1.2,
  // why
  margin: [0, 0, '1rem'],
}
