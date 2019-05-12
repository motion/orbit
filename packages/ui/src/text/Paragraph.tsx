import { gloss } from 'gloss'

import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  userSelect: 'text',
  display: 'block',

  '& > img': {
    maxWidth: '100%',
  },
})

Paragraph.defaultProps = {
  alpha: 0.85,
  sizeLineHeight: 1.2,
}
