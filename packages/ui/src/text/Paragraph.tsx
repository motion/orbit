import { gloss } from 'gloss'

import { SimpleText } from './SimpleText'

export const Paragraph = gloss(SimpleText, {
  tagName: 'p',
  userSelect: 'text',
  display: 'block',
  sizeLineHeight: 1.2,

  '& > img': {
    maxWidth: '100%',
  },
})
