import { gloss } from 'gloss'

import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  userSelect: 'text',
  display: 'block',
  alpha: 0.85,
  sizeLineHeight: 1.2,

  '& > img': {
    maxWidth: '100%',
  },
})
